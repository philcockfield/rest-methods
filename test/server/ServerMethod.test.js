import { expect } from "chai";
import ServerMethod from "../../src/server/ServerMethod";
import MethodDocs from "../../src/server/MethodDocs";


describe("Server:ServerMethod", () => {
  it("stores constructor state", () => {
    let fn = () => {};
    let method = new ServerMethod("my-method", fn, "/my-method", "GET");
    expect(method.name).to.equal("my-method");
    expect(method.func).to.equal(fn);
    expect(method.route.path).to.equal("/my-method");
    expect(method.verb).to.equal("GET");
  });


  it("stores the route information", () => {
    let fn = (action, skip) => {};
    let method = new ServerMethod("my-method", fn, "/:action?skip=:skip", "GET");
    expect(method.route.path).to.equal("/:action?skip=:skip");
    expect(method.pathRoute.path).to.equal("/:action");
  });


  it("has no documentation", () => {
    let method = new ServerMethod("foo", (id, query) => 0, "/foo/:id/edit/:query", "PUT");
    expect(method.docs).to.equal(undefined);
  });


  it("has documentation", () => {
    let method = new ServerMethod("foo", (id, query) => 0, "/foo/:id/edit/:query", "PUT", "My Docs");
    expect(method.docs).to.be.an.instanceof(MethodDocs);
    expect(method.docs.description).to.equal("My Docs");
  });


  describe("legal names", () => {
    it("is a legal name", () => {
      const names = [
        "alpha",
        "foo123",
        "foo-bar",
        "foo/bar",
        "foo-bar/baz/123"
      ];
      names.forEach(name => { new ServerMethod(name, () => 0, "/foo", "PUT"); });
    });

    describe("throws for:", () => {
      it("period (.)", () => {
        let fn = () => { new ServerMethod("foo.bar", () => 0, "/foo", "PUT"); };
        expect(fn).to.throw();
      });

      it("not alpha-numeric", () => {
        let fn = () => { new ServerMethod("foo#", () => 0, "/foo", "PUT"); };
        expect(fn).to.throw();
      });

      it("no spaces", () => {
        let fn = () => { new ServerMethod("foo bar", () => 0, "/foo", "PUT"); };
        expect(fn).to.throw();
      });

      it("starts with number", () => {
        let fn = () => { new ServerMethod("1foo", () => 0, "/foo", "PUT"); };
        expect(fn).to.throw();
      });
    });
  });


  describe("function parameters", () => {
    it("has no function parameters", () => {
      let method = new ServerMethod("foo", () => 0, "/foo", "PUT");
      expect(method.params).to.eql(undefined);
    });


    it("has function parameters", () => {
      let method = new ServerMethod("foo", (p1, p2) => 0, "/foo", "PUT");
      expect(method.params).to.eql([{ name: "p1" }, { name: "p2" }]);
    });
  });

});
