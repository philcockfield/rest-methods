import { expect } from 'chai';
import Server from '../../server';
import manifest from '../../src/server/manifest';
import { getMethods } from '../../src/server/manifest';

const fakeConnect = { use: () => {} };



describe('Server:manifest', () => {
  describe('getMethods(server)', () => {
    let server;
    beforeEach(() => { server = Server(); });

    it('returns an empty object (no methods registered)', () => {
      expect(getMethods(server)).to.eql({});
    });


    it('retrieves a single method with a GET verb', () => {
      server.methods({
        'foo': { get: () => {} }
      });
      expect(getMethods(server)).to.eql({
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
      expect(getMethods(server)).to.eql({
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
      let methods = getMethods(server);
      expect(methods.foo.url).to.equal('/foo');
      expect(methods.foo.get).to.eql({}); // No params.
      expect(methods.foo.put).to.eql({ params:['text'] });
      expect(methods.foo.post).to.eql({ params:['text'] });
      expect(methods.foo.delete).to.eql({}); // No params.
    });


    it('prefixes the base-url to the methods route', () => {
      server = Server({ basePath:'//v1///' })
      server.methods({ 'foo': (text) => {} });
      expect(getMethods(server).foo.url).to.equal('/v1/foo');
    });


    it('has a custom url', () => {
      server.methods({
        'foo': { url: '/thing/:id', get:(id) => {} }
      });
      expect(getMethods(server).foo.url).to.equal('/thing/:id');
    });
  });


  describe('manifest (default)', () => {
    it('has default version', () => {
      let server = Server();
      expect(manifest(server).version).to.eql('0.0.0');
    });


    it('has specified version', () => {
      let server = Server({ version: '1.2.3' });
      expect(manifest(server).version).to.eql('1.2.3');
    });


    it('has basePath', () => {
      let server = Server({ basePath: '//api///' });
      expect(manifest(server).basePath).to.eql('/api');
    });


    it('has no methods', () => {
      let server = Server();
      expect(manifest(server).methods).to.eql({});
    });


    it('has methods', () => {
      let server = Server();
      server.methods({ 'foo': (text) => {} });
      expect(manifest(server).methods).not.to.equal(undefined);
      expect(manifest(server).methods).to.eql(getMethods(server));
    });
  });
});
