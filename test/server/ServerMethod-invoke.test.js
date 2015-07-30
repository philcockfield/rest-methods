import { expect } from "chai";
import ServerMethod from "../../src/server/ServerMethod";
import MethodDocs from "../../src/server/MethodDocs";


describe("Server:ServerMethod: invoke()", () => {
  it("passes parameters and returns promise", (done) => {
    let fn = (num1, num2) => { return num1 + num2; };
    let method = new ServerMethod("foo", fn, "/foo", "PUT");
    method.invoke([1, 2])
    .then((result) => {
        expect(result).to.equal(3);
        done();
    });
  });


  it("passes the URL parameters into the method first", (done) => {
    let params = {};
    let fn = (id, thing, num1, num2) => {
      params.id = id;
      params.thing = thing;
      return num1 + num2;
    };
    let method = new ServerMethod("foo", fn, "/foo/:id/:thing", "PUT");

    method.invoke([1, 2], "/foo/my-id/my-thing")
    .then((result) => {
        expect(result).to.equal(3);
        expect(params.id).to.equal("my-id");
        expect(params.thing).to.equal("my-thing");
        done();
    });
  });


  it("passes parameters from the query string", () => {
    const URL = "/:org/users?skip=:skip&take=:take";
    let params;
    const fn = (org, skip, take, text) => {
        params = {
          org: org,
          skip: skip,
          take: take,
          text: text
        };
    };
    const method = new ServerMethod("foo", fn, URL, "PUT");
    method.invoke(["my-text"], "/my-org/users?skip=10&take=5");
    expect(params.org).to.equal("my-org");
    expect(params.skip).to.equal(10);
    expect(params.take).to.equal(5);
    expect(params.text).to.equal("my-text");
  });
});


describe("invoke [this] context", () => {
  it("it has the HTTP verb", (done) => {
    let self;
    let fn = function () { self = this; }
    new ServerMethod("foo", fn, "/foo", "PUT").invoke()
    .then(function() {
        expect(self.verb).to.equal("PUT");
        done();
    });
  });

  it("has the url", (done) => {
    let self;
    let fn = function (action, skip) { self = this; }
    new ServerMethod("foo", fn, "/foo/:action?skip=:skip", "PUT").invoke(null, "/foo/edit?skip=5")
    .then(function() {
        expect(self.url.path).to.equal("/foo/edit?skip=5");
        expect(self.url.params.action).to.equal('edit');
        expect(self.url.params.skip).to.equal(5);
        done();
    });
  });

  it("has no URL parameters", (done) => {
    let self;
    let fn = function () { self = this; }
    new ServerMethod("foo", fn, "/foo", "PUT").invoke(null, "/foo")
    .then(function() {
        expect(self.url.params).to.eql([]);
        done();
    });
  });

  it("has URL parameters", (done) => {
    let self;
    let fn = function(id, query) { self = this; }
    let method = new ServerMethod("foo", fn, "/foo/:id/edit/:query", "PUT")
    method.invoke(null, "/foo/123/edit/cow")
    .then(function() {
        let params = self.url.params;
        expect(params[0]).to.equal(123);
        expect(params[1]).to.equal("cow");
        expect(params.id).to.equal(123);
        expect(params.query).to.equal("cow");
        done();
    });
  });
});
