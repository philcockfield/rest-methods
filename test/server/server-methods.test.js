import { expect } from 'chai';
import _ from 'lodash';
import server from '../../server';
import Method from '../../src/server/Method';
import state from '../../src/server/state';



describe('Server:methods', () => {
  beforeEach(() => { state.reset(); });


  it('has no methods by default', () => {
    expect(server.methods()).to.eql({});
  });


  it('registers a generic method (get/post/put/delete)', () => {
    let fn = () => { return 0 };
    let methods = server.methods({ 'my-method':fn });
    expect(methods['my-method'].get).to.be.an.instanceof(Method);
    expect(methods['my-method'].put).to.be.an.instanceof(Method);
    expect(methods['my-method'].post).to.be.an.instanceof(Method);
    expect(methods['my-method'].delete).to.be.an.instanceof(Method);
    expect(methods['my-method'].get.func).to.equal(fn);
    expect(server.methods()['my-method'].get.func).to.equal(fn);
  });


  it('registers different methods for each verb (get/post/put/delete)', () => {
    let fnGET = () => {};
    let fnPUT = () => {};
    let fnPOST = () => {};
    let fnDELETE = () => {};
    let methods = server.methods({
      'my-method':{
        get: fnGET,
        put: fnPUT,
        post: fnPOST,
        delete: fnDELETE
      }
    });
    let method = methods['my-method'];
    expect(method.get.func).to.equal(fnGET);
    expect(method.put.func).to.equal(fnPUT);
    expect(method.post.func).to.equal(fnPOST);
    expect(method.delete.func).to.equal(fnDELETE);
  });


  it('only has a GET method', () => {
    let fnGET = () => {};
    let methods = server.methods({
      'my-method':{ get: fnGET }
    });
    let method = methods['my-method'];
    expect(method.get.func).to.equal(fnGET);
    expect(method.put).to.equal(undefined);
    expect(method.post).to.equal(undefined);
    expect(method.delete).to.equal(undefined);
  });


  it('builds set of methods from multiple registration calls', () => {
    server.methods({ 'method1':(() => 1) });
    server.methods({ 'method2':(() => 1) });
    expect(server.methods()['method1']).to.exist;
    expect(server.methods()['method2']).to.exist;
  });


  it('throws if the method has already been defined', () => {
    server.methods({ 'my-method':() => {} });
    let fn = () => { server.methods({ 'my-method':() => {} }); };
    expect(fn).to.throw(/Method 'my-method' already exists./);
  });


  it('throws an error if a function was not specified', () => {
    let fn = () => { server.methods({ 'my-method':123 }); };
    expect(fn).to.throw();
  });




});
