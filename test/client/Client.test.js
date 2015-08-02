import { expect } from "chai";
import * as util from "js-util";
import http from "http-promises/browser";
import { FakeXMLHttpRequest } from "sinon";
import { registerMethods, STATE } from "../../src/client/Client";
import Client from "../../src/client/Client";



describe("Client:init (constructor)", () => {
  let fakeXhr, client;
  before(() => {
      // Inject a fake XHR object.
      http.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          return fakeXhr;
      };
  });
  beforeEach(() => { client = Client({ http:http, host:"localhost" }); });


  it("is not ready by default", () => {
    expect(client.isReady).to.equal(false);
    expect(client.methods).to.eql({});
  });


  describe("[onReady] callbacks", () => {
    it("invokes callbacks when methods are registered", (done) => {
      let count = 0;
      client.onReady(() => count += 1);
      registerMethods(client, { "foo": { get:{} }});

      util.delay(100, () => {
          expect(count).to.equal(1);
          expect(client.isReady).to.equal(true);
          done();
      });
    });


    it("invokes callbacks immediately if already [isReady === true]", () => {
      let count = 0;
      client.isReady = true;
      client.onReady(() => count += 1);
      expect(count).to.equal(1);
    });
  });
});
