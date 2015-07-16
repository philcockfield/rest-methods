import { expect } from 'chai';
import server from '../../server';
import state from '../../src/server/state';
import manifest from '../../src/server/manifest';
import { getMethods } from '../../src/server/manifest';



describe('Server:manifest', () => {
  let fakeConnect = { use: () => {} };
  beforeEach(() => { server.reset(); });


  describe('getMethods()', () => {
    beforeEach(() => { server.init(fakeConnect); });


    it('returns an empty object (no methods registered)', () => {
      expect(getMethods()).to.eql({});
    });


    it('retrieves a single method with a GET verb', () => {
      server.methods({
        'foo': { get: () => {} }
      });
      expect(getMethods()).to.eql({
        'foo': {
          url: '/foo',
          get: {}
        }
      });
    });


    it('retrieves a single method with a PUT verb that has parameters', () => {
      server.methods({
        'foo': { put: (text, number) => {} }
      });
      expect(getMethods()).to.eql({
        'foo': {
          url: '/foo',
          put: {
            params: ['text', 'number']
          }
        }
      });
    });


    it('retrieves methods for each HTTP verb from a single method registration', () => {
      server.methods({ 'foo': (text) => {} });
      let methods = getMethods();
      expect(methods.foo.url).to.equal('/foo');
      expect(methods.foo.get).to.eql({}); // No params.
      expect(methods.foo.put).to.eql({ params:['text'] });
      expect(methods.foo.post).to.eql({ params:['text'] });
      expect(methods.foo.delete).to.eql({}); // No params.
    });


    it('prefixes the base-url to the methods route', () => {
      server.reset();
      server.init(fakeConnect, { basePath:'//v1///' });
      server.methods({ 'foo': (text) => {} });
      expect(getMethods().foo.url).to.equal('/v1/foo');
    });


    it('has a custom url', () => {
      server.methods({
        'foo': { url: '/thing/:id', get:(id) => {} }
      });
      expect(getMethods().foo.url).to.equal('/thing/:id');
    });
  });


  describe('manifest (default)', () => {
    it('has default version', () => {
      server.init(fakeConnect);
      expect(manifest().version).to.eql('0.0.0');
    });


    it('has specified version', () => {
      server.init(fakeConnect, { version: '1.2.3' });
      expect(manifest().version).to.eql('1.2.3');
    });


    it('has basePath', () => {
      server.init(fakeConnect, { basePath: '//api///' });
      expect(manifest().basePath).to.eql('/api');
    });


    it('has no methods', () => {
      expect(manifest().methods).to.eql({});
      server.init(fakeConnect);
      expect(manifest().methods).to.eql({});
    });


    it('has methods', () => {
      server.init(fakeConnect);
      server.methods({ 'foo': (text) => {} });
      expect(manifest().methods).not.to.equal(undefined);
      expect(manifest().methods).to.eql(getMethods());
    });
  });
});
