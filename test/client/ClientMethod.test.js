import { expect } from "chai";
import ClientMethod from "../../src/client/ClientMethod";
import { ServerMethodError } from "../../src/errors";
import { FakeXMLHttpRequest } from "sinon";
import Promise from "bluebird";
import sinon from "sinon";
import http from "http-promises/browser";


describe("Client:ClientMethod", () => {
  describe("state", () => {
    it("stores the method name", () => {
      let method = new ClientMethod("foo", http);
      expect(method.name).to.equal("foo");
    });


    it("has no verbs", () => {
      let method = new ClientMethod("foo", http);
      expect(method.verbs).to.eql({});
    });


    it("has verbs", () => {
      const options = {
        get: {}, put: { params:["text"] }
      };
      let method = new ClientMethod("foo", http, options);
      expect(method.verbs.get).to.eql({});
      expect(method.verbs.put.params).to.eql(["text"]);
    });
  });


  describe("url", () => {
    it("derives the URL from the method name", () => {
      let method = new ClientMethod("////foo/bar", http);
      expect(method.urlPattern).to.equal("/foo/bar");
      expect(method.url()).to.equal("/foo/bar");
    });


    it("takes a custom URL (no parameters)", () => {
      let method = new ClientMethod("foo", http, { url:"/foo" });
      expect(method.url()).to.equal("/foo");
    });

    it("prepends the host-name", () => {
      let method = new ClientMethod("foo", http, { url:"/foo", host:"http://localhost:3030" });
      expect(method.url()).to.equal("http://localhost:3030/foo");
    });


    it("constructs URL with parameters", () => {
      let method = new ClientMethod("foo", http, { url:"/foo/:org/:org/:id/edit?q=abc" });
      let url = method.url("acme", "edge-case", "bob");
      expect(url).to.equal("/foo/acme/edge-case/bob/edit?q=abc");
    });


    it("throws if there are not enough arguments", () => {
      let method = new ClientMethod("foo", http, { url:"/foo/:org/:id/edit?q=abc" });
      let fn = () => { method.url(); };
      expect(fn).to.throw();
    });
  });


  describe("invoke()", () => {
    let fakeXhr, sent;
    beforeEach(() => {
      sent = [];
      http.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          fakeXhr.send = (data) => {
              if (data) { data = JSON.parse(data); }
              sent.push(data);
          };
          return fakeXhr;
      };
    });


    it("sends to the method URL", () => {
      let method = new ClientMethod("foo/bar", http);
      method.invoke();
      expect(fakeXhr.url).to.equal("/foo/bar");
    });


    it("sends to a simple URL", () => {
      let method = new ClientMethod("foo/bar", http, { url:"/yo" });
      method.invoke();
      expect(fakeXhr.url).to.equal("/yo");
    });


    it("sends to a paramatised URL", () => {
      let method = new ClientMethod("foo", http, { url:"/foo/:id/edit" });
      method.invoke("GET", "my-id");
      expect(fakeXhr.url).to.equal("/foo/my-id/edit");
    });


    it("invokes with no arguments", () => {
      let method = new ClientMethod("foo", http);
      method.invoke("PUT");
      expect(sent[0].method).to.equal("foo");
      expect(sent[0].verb).to.equal("PUT");
      expect(sent[0].args).to.eql([]);
    });


    it("invokes with arguments", () => {
      let method = new ClientMethod("foo/bar", http);
      method.invoke("PUT", 1, "two", { three:3 });
      expect(sent[0].verb).to.equal("PUT");
      expect(sent[0].args).to.eql([1, "two", { three:3 }]);
    });


    it("removes the arguments passed in the URL", () => {
      let method = new ClientMethod("foo", http, { url:"foo/:id" });
      method.invoke("PUT", "my-id", 1, 2);
      expect(sent[0].args).to.eql([1, 2]);
    });


    it("resolves promise with return value", (done) => {
      new ClientMethod("foo", http).invoke()
      .then((result) => {
          expect(result).to.eql({ foo:123 });
          done()
      });
      fakeXhr.responseText = JSON.stringify({ foo:123 });
      fakeXhr.status = 200;
      fakeXhr.readyState = 4;
      fakeXhr.onreadystatechange();
    });


    it("throws an error (malformed, no reponse-text from server)", (done) => {
      new ClientMethod("foo", http).invoke()
      .catch((err) => {
          expect(err).to.be.an.instanceof(ServerMethodError);
          expect(err.status).to.equal(500);
          done()
      });
      fakeXhr.status = 500;
      fakeXhr.readyState = 4;
      fakeXhr.onreadystatechange();
    });


    it("throws an error ([ServerMethodError] returned from server)", (done) => {
      new ClientMethod("foo", http).invoke()
      .catch((err) => {
          expect(err).to.be.an.instanceof(ServerMethodError);
          expect(err.status).to.equal(503);
          expect(err.method).to.equal("my-method");
          expect(err.args).to.eql([1,2,3]);
          expect(err.message).to.equal(":(");
          done()
      });
      let serverError = new ServerMethodError(503, "my-method", [1,2,3], ":(");
      fakeXhr.responseText = JSON.stringify(serverError);
      fakeXhr.status = 500;
      fakeXhr.readyState = 4;
      fakeXhr.onreadystatechange();
    });
  });
});
