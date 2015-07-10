import { expect } from 'chai';
import proxy from '../../src/client/proxy';
import { registerMethods, state } from '../../src/client/proxy';
import MethodProxy from '../../src/client/MethodProxy';


describe('ServerProxy', () => {
  it('is not ready upon creation', () => {
    expect(proxy.isReady).to.equal(false);
  });

  describe('[onReady] callbacks', () => {
    it('invokes callbacks when methods are registered', () => {
      let count = 0;
      proxy.onReady(() => count += 1);
      registerMethods({ 'foo': {} });
      expect(count).to.equal(1);
      expect(proxy.isReady).to.equal(true);
    });


    it('invokes callbacks immediately if already [isReady === true]', () => {
      proxy.isReady = true;
      let count = 0;
      proxy.onReady(() => count += 1);
      expect(count).to.equal(1);
    });
  });


  it('stores methods in state', () => {
    registerMethods({
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
      registerMethods({ foo: () => {} });
      method = state.methods['foo'];
      method.invoke = (args) => {
        invoked.count += 1;
        invoked.args = args
      };
    });

    describe('[.call] method', () => {
      it('without parameters', () => {
        proxy.call('foo');
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([]);
      });

      it('with parameters', () => {
        proxy.call('foo', 1, 2, 3);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1, 2, 3]);
      });

      it('throws if the method does not exist', () => {
        let fn = () => { proxy.call('not-exist'); };
        expect(fn).to.throw(/Method 'not-exist' does not exist./);
      });
    });


    describe('[.apply] method', () => {
      it('without parameters', () => {
        proxy.apply('foo');
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([]);
      });

      it('with parameter array', () => {
        proxy.apply('foo', [1, 2, 3]);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1, 2, 3]);
      });

      it('with parameter converted to array (edge-case)', () => {
        proxy.apply('foo', 1, 2, 3);
        expect(invoked.count).to.equal(1);
        expect(invoked.args).to.eql([1]);
      });

      it('throws if the method does not exist', () => {
        let fn = () => { proxy.apply('not-exist'); };
        expect(fn).to.throw(/Method 'not-exist' does not exist./);
      });
    });


  });
});
