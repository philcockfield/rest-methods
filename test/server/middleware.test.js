import { expect } from 'chai';
import _ from 'lodash';
import server from '../../server';
import state from '../../src/server/state';
import { matchMethodUrl } from '../../src/server/middleware';
import ServerMethod from '../../src/server/ServerMethod';

const fakeConnect = { use: () => {} };


describe('Server:middleware', () => {
  describe('matchMethodUrl()', () => {
    beforeEach(() => {
        server.reset();
        server.init(fakeConnect);
    });


    it('matches nothing when no methods have been registered', () => {
      expect(matchMethodUrl('/foo', 'GET')).to.equal(undefined);
    });


    it('matches a simple URL', () => {
      server.methods({ 'foo': () => {}});
      ['GET', 'PUT', 'POST', 'DELETE'].map(verb => {
          expect(matchMethodUrl('/foo', verb).name).to.equal('foo');
          expect(matchMethodUrl('/foo', verb).verb).to.equal(verb);
      });
    });


    it('does not match a URL when the HTTP verb is not defined', () => {
      server.methods({
        'foo': {
          get: () => {}
        }
      });
      expect(matchMethodUrl('/foo', 'GET').name).to.equal('foo');
      expect(matchMethodUrl('/foo', 'PUT')).to.equal(undefined);
    });


    it('matches a paramatized URL', () => {
      server.methods({
        'foo': {
          url: '/foo/:id',
          get: (id) => {}
        }
      });
      expect(matchMethodUrl('/foo/123', 'GET').name).to.equal('foo');
      expect(matchMethodUrl('/foo', 'GET')).to.equal(undefined);
    });
  });
});
