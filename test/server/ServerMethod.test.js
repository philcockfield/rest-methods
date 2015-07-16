import { expect } from 'chai';
import ServerMethod from '../../src/server/ServerMethod';


describe('Server:ServerMethod', () => {
  it('stores constructor state', () => {
    let fn = () => {};
    let method = new ServerMethod('my-method', fn, '/my-method', 'GET');
    expect(method.name).to.equal('my-method');
    expect(method.func).to.equal(fn);
    expect(method.route.path).to.equal('/my-method');
    expect(method.verb).to.equal('GET');
  });

  it('has route keys', () => {
    let method = new ServerMethod('foo', (id, query) => 0, '/foo/:id/edit/:query', 'PUT');
    expect(method.route.keys[0].name).to.equal('id');
    expect(method.route.keys[1].name).to.equal('query');
  });


  describe('function parameters', () => {
    it('has no function parameters', () => {
      let method = new ServerMethod('foo', () => 0, '/foo', 'PUT');
      expect(method.params).to.eql(undefined);
    });


    it('has function parameters', () => {
      let method = new ServerMethod('foo', (p1, p2) => 0, '/foo', 'PUT');
      expect(method.params).to.eql(['p1', 'p2']);
    });


    it('throws if URL contains params that are not in the function definition', () => {
      let fn = () => {
        let method = new ServerMethod('foo', (p1, p2) => 0, '/foo/:id', 'PUT');
      };
      expect(fn).to.throw();
    });

    it('throws if there are not enough parameters for the URL', () => {
      let fn = () => {
        let method = new ServerMethod('foo', () => 0, '/foo/:id', 'PUT');
      };
      expect(fn).to.throw();
    });
  });


  describe('invoke()', () => {
    it('passes parameters and returns promise', (done) => {
      let fn = (num1, num2) => { return num1 + num2; };
      let method = new ServerMethod('foo', fn, '/foo', 'PUT');
      method.invoke([1, 2])
      .then((result) => {
          expect(result).to.equal(3);
          done();
      });
    });

    it('passes the URL parameters into the method first', (done) => {
      let params = {};
      let fn = (id, query, num1, num2) => {
        params.id = id;
        params.query = query;
        return num1 + num2;
      };
      let method = new ServerMethod('foo', fn, '/foo/:id/:query', 'PUT');

      method.invoke([1, 2], '/foo/my-id/my-query?foo=123')
      .then((result) => {
          expect(result).to.equal(3);
          expect(params.id).to.equal('my-id');
          expect(params.query).to.equal('my-query');
          done();
      });
    });
  });


  describe('invoke [this] context', () => {
    it('it has the HTTP verb', (done) => {
      let self;
      let fn = function () { self = this; }
      new ServerMethod('foo', fn, '/foo', 'PUT').invoke()
      .then(function() {
          expect(self.verb).to.equal('PUT');
          done();
      });
    });

    it('has the url', (done) => {
      let self;
      let fn = function () { self = this; }
      new ServerMethod('foo', fn, '/foo', 'PUT').invoke(null, '/foo')
      .then(function() {
          expect(self.url.path).to.equal('/foo');
          done();
      });
    });

    it('has no URL parameters', (done) => {
      let self;
      let fn = function () { self = this; }
      new ServerMethod('foo', fn, '/foo', 'PUT').invoke(null, '/foo')
      .then(function() {
          expect(self.url.params).to.eql([]);
          done();
      });
    });

    it('has URL parameters', (done) => {
      let self;
      let fn = function(id, query) { self = this; }
      let method = new ServerMethod('foo', fn, '/foo/:id/edit/:query', 'PUT')
      method.invoke(null, '/foo/123/edit/cow')
      .then(function() {
          let params = self.url.params;
          expect(params[0]).to.equal(123);
          expect(params[1]).to.equal('cow');
          expect(params.id).to.equal(123);
          expect(params.query).to.equal('cow');
          done();
      });
    });
  });
});
