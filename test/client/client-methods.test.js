import { expect } from 'chai';
import client from '../../src/client/client';
import { registerMethods } from '../../src/client/client';
import { xhr } from 'js-util';
import { FakeXMLHttpRequest } from 'sinon';



describe('Client:methods (proxy-stubs)', () => {
  beforeEach(() => { client.reset(); });

  it('does not have any methods prior to loading', () => {
    expect(client.isReady).to.equal(false);
    expect(client.methods).to.eql({});
  });


  it('has a proxy-stub for each method', () => {
    registerMethods({
      'foo': { get: {}, put:{}, post:{}, delete:{} }
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.put).to.be.an.instanceof(Function);
    expect(client.methods.foo.post).to.be.an.instanceof(Function);
    expect(client.methods.foo.delete).to.be.an.instanceof(Function);
  });


  it('has no proxy-stubs', () => {
    registerMethods({
      'foo': {}
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.get).to.equal(undefined);
    expect(client.methods.foo.put).to.equal(undefined);
    expect(client.methods.foo.post).to.equal(undefined);
    expect(client.methods.foo.delete).to.equal(undefined);
  });


  it('nests methods within a namespace', () => {
    registerMethods({
      'foo': { get: {} },
      'foo/bar': { get: {} },
      'foo/bar/baz': { get: {} }
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.bar).to.be.an.instanceof(Object);
    expect(client.methods.foo.bar.baz).to.be.an.instanceof(Object);

    expect(client.methods.foo.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.bar.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.bar.baz.get).to.be.an.instanceof(Function);
  });


  it('invokes the helper method for each HTTP verb returning a promise', (done) => {
    registerMethods({
      'foo': { get: {}, put:{}, post:{}, delete:{} }
    });
    ['get', 'put', 'post', 'delete'].forEach(verb => {
        let fakeXhr, sent;
        xhr.createXhr = () => {
            sent = [];
            fakeXhr = new FakeXMLHttpRequest();
            fakeXhr.send = (data) => { sent.push(data); };
            return fakeXhr;
        };

        let args = undefined
        if (verb === 'put' || verb === 'post') { args = 123; }

        client.methods.foo[verb](args)
        .then((result) => {
              expect(fakeXhr.method).to.equal(verb.toUpperCase());
              expect(result).to.eql({ myResponse: true });
              if (verb === 'delete') { done(); }
        })
        fakeXhr.responseText = JSON.stringify({ myResponse: true });
        fakeXhr.status = 200;
        fakeXhr.readyState = 4;
        fakeXhr.onreadystatechange();
    });
  });


  it('invokes the proxy-stub within a nested namespace', (done) => {
    registerMethods({
      'foo/bar/baz': { put: {} }
    });
    let fakeXhr, sent;
    xhr.createXhr = () => {
        sent = [];
        fakeXhr = new FakeXMLHttpRequest();
        fakeXhr.send = (data) => { sent.push(data); };
        return fakeXhr;
    };

    client.methods.foo.bar.baz.put(123)
    .then((result) => {
          expect(fakeXhr.method).to.equal('PUT');
          expect(result).to.eql({ myResponse: true });
          done();
    })
    fakeXhr.responseText = JSON.stringify({ myResponse: true });
    fakeXhr.status = 200;
    fakeXhr.readyState = 4;
    fakeXhr.onreadystatechange();
  });
});
