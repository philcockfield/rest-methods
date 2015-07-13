import { expect } from 'chai';
import server from '../../server';
import state from '../../src/server/state';



describe('Server', () => {
  beforeEach(() => { state.reset(); });

  it('throws if initialized more than once', () => {
    const connect = { use: () => {} };
    server.init(connect);
    let fn = () => { server.init(connect); };
    expect(fn).to.throw(/Already initialized./);
  });
});
