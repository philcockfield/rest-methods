import { expect } from 'chai';
import util from 'js-util';
import client from '../../src/client/client';
import { registerMethods, state } from '../../src/client/client';
import MethodProxy from '../../src/client/MethodProxy';


describe('Client:registerMethods', () => {
  beforeEach(() => { client.reset(); });


  it('is not ready upon creation', () => {
    expect(client.isReady).to.equal(false);
  });


  describe('[onReady] callbacks', () => {
    it('invokes callbacks when methods are registered', (done) => {
      let count = 0;
      client.onReady(() => count += 1);
      registerMethods({ 'foo': { get:{} }});

      util.delay(100, () => {
          expect(count).to.equal(1);
          expect(client.isReady).to.equal(true);
          done();
      });
    });


    it('invokes callbacks immediately if already [isReady === true]', () => {
      client.isReady = true;
      let count = 0;
      client.onReady(() => count += 1);
      expect(count).to.equal(1);
    });
  });


  it('stores methods in state', () => {
    registerMethods({
      'foo': {},
      'foo/bar': { get:{ params:['p1'] } }
    });
    expect(state.methods['foo']).to.be.an.instanceof(MethodProxy);
    expect(state.methods['foo/bar']).to.be.an.instanceof(MethodProxy);
  });
});
