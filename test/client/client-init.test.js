import { expect } from 'chai';
import util from 'js-util';
import { xhr } from 'js-util';
import { FakeXMLHttpRequest } from 'sinon';
import client from '../../src/client/client';
import { state } from '../../src/client/client';



describe('Client:init', () => {
  let fakeXhr;

  beforeEach(() => {
    client.reset();

    // Inject a fake XHR object.
    xhr.createXhr = () => {
        fakeXhr = new FakeXMLHttpRequest();
        return fakeXhr;
    };
  });


  it('registers methods upon recieving manifest from server', (done) => {
    expect(client.isReady).to.equal(false);

    const serverResponse = {
      methods: {
        foo: { params: [] }
      }
    };

    client.init().then(() => {
        expect(client.isReady).to.equal(true);
        expect(state.methods['foo'].name).to.equal('foo');
        done()
    });

    fakeXhr.responseText = JSON.stringify(serverResponse);
    fakeXhr.status = 200;
    fakeXhr.readyState = 4;
    fakeXhr.onreadystatechange();
  });

});
