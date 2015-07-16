import { expect } from 'chai';
import Server from '../../server';
import { matchMethodUrl } from '../../src/server/middleware';


describe('Server:middleware', () => {
  let server;
  describe('matchMethodUrl()', () => {
    beforeEach(() => {
        server = Server();
    });


    it('matches nothing when no methods have been registered', () => {
      expect(matchMethodUrl(server, '/foo', 'GET')).to.equal(undefined);
    });


    it('matches a simple URL', () => {
      server.methods({ 'foo': () => {}});
      ['GET', 'PUT', 'POST', 'DELETE'].map(verb => {
          expect(matchMethodUrl(server, '/foo', verb).name).to.equal('foo');
          expect(matchMethodUrl(server, '/foo', verb).verb).to.equal(verb);
      });
    });


    it('does not match a URL when the HTTP verb is not defined', () => {
      server.methods({
        'foo': {
          get: () => {}
        }
      });
      expect(matchMethodUrl(server, '/foo', 'GET').name).to.equal('foo');
      expect(matchMethodUrl(server, '/foo', 'PUT')).to.equal(undefined);
    });


    it('matches a paramatized URL', () => {
      server.methods({
        'foo': {
          url: '/foo/:id',
          get: (id) => {}
        }
      });
      expect(matchMethodUrl(server, '/foo/123', 'GET').name).to.equal('foo');
      expect(matchMethodUrl(server, '/foo', 'GET')).to.equal(undefined);
    });
  });
});
