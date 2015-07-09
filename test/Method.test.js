import { expect } from 'chai';
import Method from '../src/server/Method';


describe('Method', () => {
  it('stores name and function', () => {
    let fn = () => {};
    let method = new Method('my-method', fn);
    expect(method.name).to.equal('my-method');
    expect(method.func).to.equal(fn);
  });


  it('throws if a name was not specified', () => {
    let fn = () => { new Method(); };
    expect(fn).to.throw(/Method name not specified./);
  });


  it('throws if a function was not specified', () => {
    let fn = () => { new Method('foo'); };
    expect(fn).to.throw(/Function not specified for the method 'foo'./);
  });

});
