import { expect } from 'chai';
import Method from '../../src/server/ServerMethod';


describe('Server:ServerMethod', () => {
  it('stores constructor state', () => {
    let fn = () => {};
    let method = new Method('my-method', fn, '/my-method', 'GET');
    expect(method.name).to.equal('my-method');
    expect(method.func).to.equal(fn);
    expect(method.route.path).to.equal('/my-method');
    expect(method.verb).to.equal('GET');
  });


  it('has no function parameters', () => {
    let method = new Method('foo', () => 0, '/foo', 'PUT');
    expect(method.params).to.eql([]);
  });


  it('has function parameters', () => {
    let method = new Method('foo', (p1, p2) => 0, '/foo', 'PUT');
    expect(method.params).to.eql(['p1', 'p2']);
  });

  describe('invoke()', () => {
    it('passes parameters and returns promise', (done) => {
      let fn = (num1, num2) => { return num1 + num2; };
      let method = new Method('foo', fn, '/foo', 'PUT');
      method.invoke([1, 2])
      .then((result) => {
          expect(result).to.equal(3);
          done();
      });
    });


    it('passes details within [this] context', (done) => {
      let self = undefined;
      let fn = function () {
        self = this;
      }
      new Method('foo', fn, '/foo', 'PUT').invoke()
      .then(function() {
          expect(self.verb).to.equal('PUT');
          done();
      });
    });
  });
});
