import { expect } from 'chai';
import _ from 'lodash';
import server from '../../server';
import Method from '../../src/server/Method';
import state from '../../src/server/state';



describe('server.methods', () => {
  beforeEach(() => { state.reset(); });


  it('has no methods by default', () => {
    expect(server.methods()).to.eql({});
  });


  it('registers a method and returns it on the result set', () => {
    let fn = () => { return 0 };
    let methods = server.methods({ 'foo/my-method':fn });
    expect(methods['foo/my-method']).to.be.an.instanceof(Method);
    expect(methods['foo/my-method'].func).to.equal(fn);
    expect(server.methods()['foo/my-method'].func).to.equal(fn);
  });


  it('builds set of methods from multiple registration calls', () => {
    server.methods({ 'method1':(() => 1) });
    server.methods({ 'method2':(() => 1) });
    expect(server.methods()['method1']).to.exist;
    expect(server.methods()['method2']).to.exist;
  });


  describe('Error conditions', () => {
    it('throws an error if a function was not specified', () => {
      let fn = () => { server.methods({ 'my-method':123 }); };
      expect(fn).to.throw();
    });


    it('throws if the method has already been defined', () => {
      server.methods({ 'my-method':() => {} });
      let fn = () => { server.methods({ 'my-method':() => {} }); };
      expect(fn).to.throw(/Method 'my-method' already exists./);
    });
  });
});
