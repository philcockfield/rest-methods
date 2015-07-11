import { expect } from 'chai';
import util from 'js-util';
import { xhr } from 'js-util';
import { FakeXMLHttpRequest } from 'sinon';
import proxy from '../../src/client/proxy';
import { init, state } from '../../src/client/proxy';



describe('init', () => {
  let fakeXhr;

  beforeEach(() => {
    proxy.reset();

    // Inject a fake XHR object.
    xhr.createXhr = () => {
        fakeXhr = new FakeXMLHttpRequest();
        return fakeXhr;
    };
  });


  it('registers methods upon recieving manifest from server', (done) => {
    expect(proxy.isReady).to.equal(false);

    const serverResponse = {
      methods: {
        foo: { params: [] }
      }
    };

    init().then(() => {
        expect(proxy.isReady).to.equal(true);
        expect(state.methods['foo'].name).to.equal('foo');
        done()
    });

    fakeXhr.responseText = JSON.stringify(serverResponse);
    fakeXhr.status = 200;
    fakeXhr.onload();
  });

});
