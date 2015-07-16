import { expect } from 'chai';
import Server from '../../server';
import state from '../../src/server/state';


describe('Server:state (Internal)', () => {
  it('resets state', () => {
    Server.methods({ 'state-test': () => 0 });
    expect(Server.methods()).not.to.eql({});
    state.reset();
    expect(Server.methods()).to.eql({});
  });
});
