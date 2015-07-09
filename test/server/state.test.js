import { expect } from 'chai';
import Immutable from 'immutable';
import Server from '../../';
import state from '../../src/server/state';


describe('State (Internal)', () => {
  it('resets state', () => {
    Server.methods({ 'state-test': () => 0 });
    expect(Server.methods()).not.to.eql({});
    state.reset();
    expect(Server.methods()).to.eql({});
  });

  it('exposes the set of methods', () => {
    expect(state.methods).to.be.an.instanceof(Immutable.Map);
  });
});
