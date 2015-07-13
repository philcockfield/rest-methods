import { expect } from 'chai';
import util from 'js-util';
import { xhr } from 'js-util';
import { FakeXMLHttpRequest } from 'sinon';
import client from '../../src/client/client';
import { registerMethods, state } from '../../src/client/client';



describe('Client (Invoking)', () => {
  beforeEach(() => { client.reset(); });

  describe('.invoke() with HTTP verb', () => {
    let method, invoked;
    beforeEach(() => {
      invoked = { count: 0 };
      registerMethods({
        foo: {
          get: {},
          put: {},
          post: {},
          delete: {},
        }
      });
      method = state.methods['foo'];
      method.invoke = (verb, args) => {
          invoked.count += 1;
          invoked.args = args
      };
    });

    it('without parameters', () => {
      client.invoke('GET', 'foo');
      expect(invoked.count).to.equal(1);
      expect(invoked.args).to.eql([]);
    });

    it('with parameters', () => {
      client.invoke('GET', 'foo', [1, 2, 3]);
      expect(invoked.count).to.equal(1);
      expect(invoked.args).to.eql([1, 2, 3]);
    });

    it('throws if the method does not exist', () => {
      let fn = () => { client.invoke('GET', 'not-exist'); };
      expect(fn).to.throw();
    });


    describe('queueing invoked calls prior to being ready', () => {
      let fakeXhr;
      beforeEach(() => {
        client.reset();
        expect(client.isReady).to.equal(false);
        expect(state.queue).to.eql([]);
        xhr.createXhr = () => {
            fakeXhr = new FakeXMLHttpRequest();
            return fakeXhr;
        };
      });


      it('adds a `.invoke()` to the queue and returns a promise', () => {
        let promise = client.invoke('GET', 'foo', [1, 2, 3]);
        expect(state.queue[0].methodName).to.equal('foo');
        expect(state.queue[0].args).to.eql([1, 2, 3]);
        expect(promise.then).to.be.an.instanceof(Function);
      });


      it('invokes the queued method when ready', (done) => {
        client.invoke('GET', 'foo', [1, 2])
        .then((result) => {
            expect(result).to.eql({ number:123 });
            done();
        });
        registerMethods({ foo:{ get:{} }});
        fakeXhr.responseText = JSON.stringify({ number:123 });
        fakeXhr.status = 200;
        fakeXhr.readyState = 4;
        fakeXhr.onreadystatechange();
      });


      it('empties the queue', () => {
        client.invoke('GET', 'foo', [1, 2]);
        expect(state.queue.length).to.equal(1);
        registerMethods({ foo:{ get:{} } });
        expect(state.queue.length).to.equal(0);
      });


      it('throws when a queued method does not exist', () => {
        client.invoke('GET', 'not-exist', 1, 2);
        let fn = () => {
          registerMethods({ foo:{ params:[] } });
        };
        expect(fn).to.throw();
      });
    });
  });

  describe('verb specific invoke functions (get | put | post | delete)', () => {
    let fakeXhr;
    beforeEach(() => {
      client.reset();
      registerMethods({
        'foo': { get:{}, put:{}, post:{}, delete:{} }
      });
      xhr.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          return fakeXhr;
      };
    });

    let serverCallback = () => {
        fakeXhr.status = 200;
        fakeXhr.readyState = 4;
        fakeXhr.onreadystatechange();
    };

    it('get()', (done) => {
      client.get('foo').then(() => { done(); });
      serverCallback();
    });

    it('put()', (done) => {
      client.put('foo').then(() => { done(); });
      serverCallback();
    });

    it('post()', (done) => {
      client.post('foo').then(() => { done(); });
      serverCallback();
    });

    it('delete()', (done) => {
      client.delete('foo').then(() => { done(); });
      serverCallback();
    });

  });
});
