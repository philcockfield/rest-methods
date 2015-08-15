import { expect } from "chai";
import Server from "../../src/server/server";


describe("Server:middleware", () => {
  let server;
  beforeEach(() => {
    server = Server();
  });


  it("matches nothing when no methods have been registered", () => {
    expect(server.match("/foo", "GET")).to.equal(undefined);
  });


  it("matches a simple URL", () => {
    server.methods({ "foo": () => {}});
    ["GET", "PUT", "POST", "DELETE"].map(verb => {
        expect(server.match("/foo", verb).name).to.equal("foo");
        expect(server.match("/foo", verb).verb).to.equal(verb);
    });
  });


  it("does not match a URL when the HTTP verb is not defined", () => {
    server.methods({
      "foo": {
        get: () => {}
      }
    });
    expect(server.match("/foo", "GET").name).to.equal("foo");
    expect(server.match("/foo", "PUT")).to.equal(undefined);
  });


  it("matches a paramatized URL", () => {
    server.methods({
      "foo": {
        url: "/foo/:id",
        get: (id) => {}
      }
    });
    expect(server.match("/foo/123", "GET").name).to.equal("foo");
    expect(server.match("/foo", "GET")).to.equal(undefined);
  });
});
