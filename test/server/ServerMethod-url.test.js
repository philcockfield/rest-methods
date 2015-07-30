import { expect } from "chai";
import ServerMethod from "../../src/server/ServerMethod";


describe("Server:Server Method URL", () => {
  it("has no route keys", () => {
    let method = new ServerMethod("foo", (id, query) => 0, "/foo/edit", "PUT");
    expect(method.route.keys).to.eql([]);
  });


  it("has route keys from [:variables] within path", () => {
    let method = new ServerMethod("foo", (id, query) => 0, "/foo/:id/edit/:query", "PUT");
    expect(method.route.keys[0].name).to.equal("id");
    expect(method.route.keys[1].name).to.equal("query");
  });


  it("has route keys from [:variables] within query-string", () => {
    const URL = "/users?skip=:skip&take=:take";
    let method = new ServerMethod("foo", (skip, take) => 0, URL, "PUT");
  });


  it('throws if URL contains params that are not in the function definition (path)', () => {
    let fn = () => {
      let method = new ServerMethod('foo', (p1, p2) => 0, '/foo/:id', 'PUT');
    };
    expect(fn).to.throw();
  });


  it('throws if URL contains params that are not in the function definition (query-string)', () => {
    let fn = () => {
      let method = new ServerMethod('foo', (p1, p2) => 0, '/foo?skip=:skip', 'PUT');
    };
    expect(fn).to.throw();
  });


  it('throws if there are not enough parameters for the URL', () => {
    let fn = () => {
      let method = new ServerMethod('foo', () => 0, '/foo/:id', 'PUT');
    };
    expect(fn).to.throw();
  });
});
