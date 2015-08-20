import { expect } from "chai";
import Server from "../../src/server/server";
import manifest from "../../src/server/manifest";
import { getMethods } from "../../src/server/manifest";



describe("Server:manifest", () => {
  describe("getMethods(server)", () => {
    let server;
    beforeEach(() => { server = Server(); });

    it("returns an empty object (no methods registered)", () => {
      expect(getMethods(server)).to.eql({});
    });


    it("does not add method definitions that are empty", () => {
      server.methods({
        "foo": {}
      });
      expect(getMethods(server)).to.eql({});
    });


    it("retrieves a single method with a GET verb", () => {
      server.methods({
        "foo": { get: (id) => {} } // NB: The parameter is stripped off and ignored.
      });
      expect(getMethods(server)).to.eql({
        "foo": {
          name: "foo",
          url: "/foo",
          get: {}
        }
      });
    });

    it("retrieves a single method with a GET verb with a URL parameter", () => {
      server.methods({
        "foo": {
          url: "foo/:id",
          get: (id, ignored) => {}
        }
      });
      expect(getMethods(server)).to.eql({
        "foo": {
          name: "foo",
          url: "/foo/:id",
          get: {
            params: [{ name:"id" }]
          }
        }
      });
    });


    it("retrieves a single method with a PUT verb that has parameters", () => {
      server.methods({
        "foo": { put: (text, number) => {} }
      });
      expect(getMethods(server)).to.eql({
        "foo": {
          name: "foo",
          url: "/foo",
          put: {
            params: [{ name:"text" }, { name:"number" }]
          }
        }
      });
    });


    it("retrieves a single method with a GET verb", () => {
      server.methods({
        "foo": { get: () => {} }
      });
      expect(getMethods(server)).to.eql({
        "foo": {
          name: "foo",
          url: "/foo",
          get: {}
        }
      });
    });


    it("stores the full code-path in the method name", () => {
      server.methods({
        "foo/bar/user": { get: () => {} }
      });
      expect(getMethods(server)["foo/bar/user"].name).to.equal("foo.bar.user");
    });


    it("retrieves methods for each HTTP verb from a single method registration", () => {
      server.methods({ "foo": (text) => {} });
      let methods = getMethods(server);
      expect(methods.foo.url).to.equal("/foo");
      expect(methods.foo.get).to.eql({}); // No params.
      expect(methods.foo.put).to.eql({ params:[{ name: "text" }] });
      expect(methods.foo.post).to.eql({ params:[{ name: "text" }] });
      expect(methods.foo.delete).to.eql({}); // No params.
    });


    it("prefixes the base-url to the methods route", () => {
      server = Server({ basePath:"//v1///" })
      server.methods({ "foo": (text) => {} });
      expect(getMethods(server).foo.url).to.equal("/v1/foo");
    });


    it("has a custom url", () => {
      server.methods({
        "foo": { url: "/thing/:id", get:(id) => {} }
      });
      expect(getMethods(server).foo.url).to.equal("/thing/:id");
    });
  });


  describe("manifest (default)", () => {
    it("has the service name", () => {
      let server = Server();
      expect(manifest(server).name).to.eql(server.name);
      server = Server({ name:"Foo" });
      expect(manifest(server).name).to.eql("Foo");
    });


    it("has default version", () => {
      let server = Server();
      expect(manifest(server).version).to.eql("0.0.0");
    });


    it("has specified version", () => {
      let server = Server({ version: "1.2.3" });
      expect(manifest(server).version).to.eql("1.2.3");
    });


    it("has basePath", () => {
      let server = Server({ basePath: "//api///" });
      expect(manifest(server).basePath).to.eql("/api");
    });


    it("has no methods", () => {
      let server = Server();
      expect(manifest(server).methods).to.eql({});
    });


    it("has methods", () => {
      let server = Server();
      server.methods({ "foo": (text) => {} });
      expect(manifest(server).methods).not.to.equal(undefined);
      expect(manifest(server).methods).to.eql(getMethods(server));
    });
  });
});
