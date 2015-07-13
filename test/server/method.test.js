import { expect } from 'chai';
import Method from '../../src/server/Method';


describe('Server:Method', () => {
  it('stores constructor state', () => {
    let fn = () => {};
    let method = new Method('my-method', fn, '/my-method', 'GET');
    expect(method.name).to.equal('my-method');
    expect(method.func).to.equal(fn);
    expect(method.route.path).to.equal('/my-method');
  });

  it('throws if a name was not specified', () => {
    let fn = () => { new Method(); };
    expect(fn).to.throw(/Method name not specified./);
  });


  it('throws if a function was not specified', () => {
    let fn = () => { new Method('foo'); };
    expect(fn).to.throw(/Function not specified for the method 'foo'./);
  });


  it('throws if a URL was not specified', () => {
    let fn = () => { new Method('foo', () => {}); };
    expect(fn).to.throw(/URL pattern not specified for the method 'foo'./);
  });


  it('has no parameters', () => {
    let method = new Method('foo', () => 0, '/foo');
    expect(method.params).to.eql([]);
  });


  it('has parameters', () => {
    let method = new Method('foo', (p1, p2) => 0, '/foo');
    expect(method.params).to.eql(['p1', 'p2']);
  });
});
