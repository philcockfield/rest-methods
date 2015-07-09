import { expect } from 'chai';
import MethodProxy from '../../src/client/MethodProxy';


describe('MethodProxy', () => {
  it('stores the method name', () => {
    let method = new MethodProxy('foo');
    expect(method.name).to.equal('foo');
  });


  it('has no params', () => {
    let method = new MethodProxy('foo');
    expect(method.params).to.eql([]);
  });


  it('has params', () => {
    let method = new MethodProxy('foo', ['p1', 'p2']);
    expect(method.params).to.eql(['p1', 'p2']);
  });
});
