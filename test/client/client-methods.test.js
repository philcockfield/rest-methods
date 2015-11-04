import { expect } from "chai";
import { registerMethods } from "../../src/client/Client";
import http from "http-promises/browser";
import { FakeXMLHttpRequest } from "sinon";
import ClientMethod from "../../src/client/ClientMethod";
import Client from "../../src/client/Client";
import { STATE } from "../../src/client/Client";



describe("Client:methods (proxy-stubs)", () => {
  let client, fakeXhr;
  before(() => {
      // Inject a fake XHR object.
      http.createXhr = () => {
          fakeXhr = new FakeXMLHttpRequest();
          return fakeXhr;
      };
  });
  beforeEach(() => { client = Client({ http:http, host:"localhost" }); });


  it("does not have any methods prior to loading", () => {
    expect(client.isReady).to.equal(false);
    expect(client.methods).to.eql({});
  });


  it("registers methods upon receiving manifest from server", (done) => {
    client.onReady(() => {
        expect(client.isReady).to.equal(true);
        expect(client.methods["foo"]).not.to.equal(undefined);
        done();
    });

    fakeXhr.responseText = JSON.stringify({
      methods: {
        foo: { params: [] }
      }
    });
    fakeXhr.status = 200;
    fakeXhr.readyState = 4;
    fakeXhr.onreadystatechange();
  });


  it("stores methods in state", () => {
    registerMethods(client, {
      "foo": {},
      "foo/bar": { get:{ params:["p1"] } }
    });
    expect(client[STATE].methods["foo"]).to.be.an.instanceof(ClientMethod);
    expect(client[STATE].methods["foo/bar"]).to.be.an.instanceof(ClientMethod);
  });


  it("has a proxy-stub for each method", () => {
    registerMethods(client, {
      "foo": { get: {}, put:{}, post:{}, delete:{} }
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.put).to.be.an.instanceof(Function);
    expect(client.methods.foo.post).to.be.an.instanceof(Function);
    expect(client.methods.foo.delete).to.be.an.instanceof(Function);
  });


  it("has no proxy-stubs", () => {
    registerMethods(client, {
      "foo": {}
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.get).to.equal(undefined);
    expect(client.methods.foo.put).to.equal(undefined);
    expect(client.methods.foo.post).to.equal(undefined);
    expect(client.methods.foo.delete).to.equal(undefined);
  });


  it("nests methods within a namespace", () => {
    registerMethods(client, {
      "foo": { get: {} },
      "foo/bar": { get: {} },
      "foo/bar/baz": { get: {} }
    });
    expect(client.methods.foo).to.be.an.instanceof(Object);
    expect(client.methods.foo.bar).to.be.an.instanceof(Object);
    expect(client.methods.foo.bar.baz).to.be.an.instanceof(Object);

    expect(client.methods.foo.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.bar.get).to.be.an.instanceof(Function);
    expect(client.methods.foo.bar.baz.get).to.be.an.instanceof(Function);
  });


  it("invokes the helper method for each HTTP verb returning a promise", (done) => {
    registerMethods(client, {
      "foo": { get: {}, put:{}, post:{}, delete:{} }
    });
    ["get", "put", "post", "delete"].forEach(verb => {
        let fakeXhr, sent;
        http.createXhr = () => {
            sent = [];
            fakeXhr = new FakeXMLHttpRequest();
            fakeXhr.send = (data) => { sent.push(data); };
            return fakeXhr;
        };

        let args = undefined
        if (verb === "put" || verb === "post") { args = 123; }

        client.methods.foo[verb](args)
        .then(result => {
              expect(fakeXhr.method).to.equal(verb.toUpperCase());
              expect(result).to.eql({ myResponse: true });
              if (verb === "delete") { done(); }
        })
        fakeXhr.responseText = JSON.stringify({ myResponse: true });
        fakeXhr.status = 200;
        fakeXhr.readyState = 4;
        fakeXhr.onreadystatechange();
    });
  });


  it("invokes the proxy-stub within a nested namespace", (done) => {
    registerMethods(client, {
      "foo/bar/baz": { put: {} }
    });
    let fakeXhr, sent;
    http.createXhr = () => {
        sent = [];
        fakeXhr = new FakeXMLHttpRequest();
        fakeXhr.send = (data) => { sent.push(data); };
        return fakeXhr;
    };

    client.methods.foo.bar.baz.put(123)
    .then(result => {
          expect(fakeXhr.method).to.equal("PUT");
          expect(result).to.eql({ myResponse: true });
          done();
    })
    fakeXhr.responseText = JSON.stringify({ myResponse: true });
    fakeXhr.status = 200;
    fakeXhr.readyState = 4;
    fakeXhr.onreadystatechange();
  });
});
