import { expect } from 'chai';
import MethodProxy from '../../src/client/MethodProxy';
import { xhr } from 'js-util';
import { FakeXMLHttpRequest } from 'sinon';
import Promise from 'bluebird';
const { XhrError, XhrParseError } = xhr;


describe('Client:MethodProxy', () => {

  describe('state', () => {
    it('stores constructor values', () => {
      let method = new MethodProxy('foo');
      expect(method.name).to.equal('foo');
      expect(method.urlPattern).to.equal('/');
    });


    it('has no verbs', () => {
      let method = new MethodProxy('foo');
      expect(method.verbs).to.eql({});
    });


    it('has verbs', () => {
      const options = {
        get: {}, put: { params:['text'] }
      };
      let method = new MethodProxy('foo', options);
      expect(method.verbs.get).to.eql({});
      expect(method.verbs.put.params).to.eql(['text']);
    });
  });


  it('returns the url', () => {
    let method = new MethodProxy('foo', { url:'/foo' });
    expect(method.url()).to.equal('/foo');
  });


  describe('invoke()', () => {
    let fakeXhr, sent;
    beforeEach(() => {
      sent = [];
      xhr.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          fakeXhr.send = (data) => {
              if (data) { data = JSON.parse(data); }
              sent.push(data);
          };
          return fakeXhr;
      };
    });


    it('invokes against the correct URL', () => {
      let method = new MethodProxy('foo/bar');
      method.invoke();
      expect(fakeXhr.url).to.equal(method.url());
    });


    it('invokes with no arguments', () => {
      let method = new MethodProxy('foo/bar');
      method.invoke();
      expect(sent[0].method).to.equal('foo/bar');
      expect(sent[0].verb).to.equal('GET');
      expect(sent[0].args).to.eql([]);
    });


    it('invokes with arguments', () => {
      let method = new MethodProxy('foo/bar');
      method.invoke('PUT', 1, 'two', { three:3 });
      expect(sent[0].verb).to.equal('PUT');
      expect(sent[0].args).to.eql([1, 'two', { three:3 }]);
    });


    it('resolves promise with return value', (done) => {
      new MethodProxy('foo').invoke()
      .then((result) => {
          expect(result).to.eql({ foo:123 });
          done()
      });
      fakeXhr.responseText = JSON.stringify({ foo:123 });
      fakeXhr.status = 200;
      fakeXhr.readyState = 4;
      fakeXhr.onreadystatechange();
    });


    it('throws an error', (done) => {
      new MethodProxy('foo').invoke()
      .catch(XhrError, (err) => {
          expect(err.status).to.equal(500);
          done()
      });
      fakeXhr.status = 500;
      fakeXhr.readyState = 4;
      fakeXhr.onreadystatechange();
    });
  });
});
