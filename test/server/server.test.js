import { expect } from 'chai';
import _ from 'lodash';
import Server from '../../';
import Method from '../../src/server/method';
import state from '../../src/server/state';



describe('Server', () => {
  beforeEach(() => {
    state.reset();
  });


  it('has a `methods` function', () => {
    expect(Server.methods).to.be.an.instanceof(Function);
  });


  describe('Methods', () => {
    it('has no methods by default', () => {
      expect(Server.methods()).to.eql({});
    });


    it('registers a method and returns it on the result set', () => {
      let fn = () => { return 0 };
      let methods = Server.methods({ 'foo/my-method':fn });
      expect(methods['foo/my-method']).to.be.an.instanceof(Method);
      expect(methods['foo/my-method'].func).to.equal(fn);
      expect(Server.methods()['foo/my-method'].func).to.equal(fn);
    });


    it('builds set of methods from multiple registration calls', () => {
      Server.methods({ 'method1':(() => 1) });
      Server.methods({ 'method2':(() => 1) });
      expect(Server.methods()['method1']).to.exist;
      expect(Server.methods()['method2']).to.exist;
    });
  });


  describe('Error conditions', () => {
    it('throws an error if a function was not specified', () => {
      let fn = () => {
        Server.methods({ 'my-method':123 });
      };
      expect(fn).to.throw();
    });


    it('throws if the method has already been defined', () => {
      Server.methods({ 'my-method':() => {} });
      let fn = () => {
        Server.methods({ 'my-method':() => {} });
      };
      expect(fn).to.throw(/Method 'my-method' already exists./);
    });
  });
});
