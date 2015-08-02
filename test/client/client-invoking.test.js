import { expect } from "chai";
import * as util from "js-util";
import http from "http-promises/browser";
import { FakeXMLHttpRequest } from "sinon";
import Client from "../../src/client/Client";
import { registerMethods, STATE } from "../../src/client/Client";



describe("Client (Invoking)", () => {
  let client, fakeXhr;

  before(() => {
      // Inject a fake XHR object.
      http.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          return fakeXhr;
      };
  });

  beforeEach(() => { client = Client({ http:http, host:"localhost" }) });



  describe(".invoke() with HTTP verb", () => {
    let method, invoked;
    beforeEach(() => {

      invoked = { count: 0 };
      registerMethods(client, {
        foo: {
          get: {},
          put: {},
          post: {},
          delete: {},
        }
      });
      method = client[STATE].methods["foo"];
      method.invoke = (verb, args) => {
          invoked.count += 1;
          invoked.args = args
      };
    });

    it("without parameters", () => {
      client.invoke("GET", "foo");
      expect(invoked.count).to.equal(1);
      expect(invoked.args).to.eql([]);
    });

    it("with parameters", () => {
      client.invoke("GET", "foo", [1, 2, 3]);
      expect(invoked.count).to.equal(1);
      expect(invoked.args).to.eql([1, 2, 3]);
    });

    it("throws if the method does not exist", () => {
      let fn = () => { client.invoke("GET", "not-exist"); };
      expect(fn).to.throw();
    });
  });



  describe("verb specific invoke functions (get | put | post | delete)", () => {
    beforeEach(() => {
      registerMethods(client, {
        "foo": { get:{}, put:{}, post:{}, delete:{} }
      });
    });

    let serverCallback = () => {
        fakeXhr.status = 200;
        fakeXhr.readyState = 4;
        fakeXhr.onreadystatechange();
    };

    it("get()", (done) => {
      client.get("foo").then(() => { done(); });
      serverCallback();
    });

    it("put()", (done) => {
      client.put("foo").then(() => { done(); });
      serverCallback();
    });

    it("post()", (done) => {
      client.post("foo").then(() => { done(); });
      serverCallback();
    });

    it("delete()", (done) => {
      client.delete("foo").then(() => { done(); });
      serverCallback();
    });

  });
});
