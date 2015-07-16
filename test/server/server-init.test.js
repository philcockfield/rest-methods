import { expect } from 'chai';
import Server from '../../server';
const fakeConnect = { use: () => {} };


describe('Server', () => {
  it('has the given connect server', () => {
    let server = Server({ connect:fakeConnect });
    expect(server.connect).to.equal(fakeConnect);
  });


  it('constructs a default connect server', () => {
    let server = Server();
    expect(server.connect.use).to.be.an.instanceof(Function);
  });


  it('has no base path by default', () => {
    let server = Server();
    expect(server.basePath).to.equal('/');
  });


  it('initializes with a base URL path', () => {
    let server = Server({ basePath: '////api/////' });
    expect(server.basePath).to.equal('/api');
  });


  it('initializes with a version', () => {
    let server = Server();
    expect(server.version).to.equal('0.0.0');

    server = Server({ version:'1.2.3' });
    expect(server.version).to.equal('1.2.3');
  });

});
