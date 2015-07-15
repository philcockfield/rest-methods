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

  it('initializes with a base URL path', () => {
    server.init(connect, { basePath: '////api/////' });
    expect(state.basePath).to.equal('/api');
  });


  it('initializes with a version', () => {
    server.init(connect, { version:'1.2.3' })
    expect(state.version).to.equal('1.2.3');
  });

});
