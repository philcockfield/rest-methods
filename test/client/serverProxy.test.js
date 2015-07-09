import { expect } from 'chai';
import serverProxy from '../../src/client/serverProxy';
import state from '../../src/client/state';
import MethodProxy from '../../src/client/MethodProxy';


describe('ServerProxy', () => {
  it('is not ready upon creation', () => {
    expect(serverProxy.isReady).to.equal(false);
  });


  it('fires [onReady] callbacks when methods are registered', () => {
    let count = 0;
    serverProxy.onReady(() => count += 1);
    serverProxy.registerMethods({ 'foo': {} });
    expect(count).to.equal(1);
    expect(serverProxy.isReady).to.equal(true);
  });


  it('stores methods in state', () => {
    serverProxy.registerMethods({
      'foo': { params:[] },
      'foo/bar': {params:['p1']}
    });
    expect(state.methods['foo']).to.be.an.instanceof(MethodProxy);
    expect(state.methods['foo/bar']).to.be.an.instanceof(MethodProxy);
  });


  describe('invokes via [call] and [apply]', () => {
    let method;
    let invoked;

    beforeEach(() => {
      invoked = { count: 0 };
      serverProxy.registerMethods({ foo: () => {} });
      method = state.methods['foo'];
      method.invoke = (args) => {
        invoked.count += 1;
        invoked.args = args
      };
    });

    describe('[.call] method', () => {
      it('without parameters', () => {
        serverProxy.call('foo');
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([]);
      });

      it('with parameters', () => {
        serverProxy.call('foo', 1, 2, 3);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1, 2, 3]);
      });

      it('throws if the method does not exist', () => {
        let fn = () => { serverProxy.call('not-exist'); };
        expect(fn).to.throw(/Method 'not-exist' does not exist./);
      });
    });


    describe('[.apply] method', () => {
      it('without parameters', () => {
        serverProxy.apply('foo');
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([]);
      });

      it('with parameter array', () => {
        serverProxy.apply('foo', [1, 2, 3]);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1, 2, 3]);
      });

      it('with parameter converted to array (edge-case)', () => {
        serverProxy.apply('foo', 1, 2, 3);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1]);
      });

      it('throws if the method does not exist', () => {
        let fn = () => { serverProxy.apply('not-exist'); };
        expect(fn).to.throw(/Method 'not-exist' does not exist./);
      });
    });


  });
});
