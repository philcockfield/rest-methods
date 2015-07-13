import { expect } from 'chai';
import server from '../../server';
import state from '../../src/server/state';



describe('Server', () => {
  beforeEach(() => { server.reset(); });
  const connect = { use: () => {} };

  it('throws if initialized more than once', () => {
    server.init(connect);
    let fn = () => { server.init(connect); };
    expect(fn).to.throw(/Already initialized./);
  });


  it('has no base path by default', () => {
    expect(state.basePath).to.equal('/');
  });


  it('configures with a base path', () => {
    server.init(connect, { basePath: '////api/////' });
    expect(state.basePath).to.equal('/api');
  });

});
