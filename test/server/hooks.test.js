import { expect } from "chai";
import * as util from "js-util";
import { HANDLERS } from "../../src/const";
import Server from "../../src/server/server";


describe("Before/After Hooks", function() {
  let server;
  beforeEach(() => {
    server = Server();
  });


  it("has a private HANDLERS object", () => {
    expect(server[HANDLERS].before).to.be.an.instanceof(util.Handlers);
    expect(server[HANDLERS].after).to.be.an.instanceof(util.Handlers);
  });


  it("stores a [before] handler", () => {
    const fn = () => 0;
    const  result = server.before(fn);
    expect(result).to.equal(server);
    expect(server[HANDLERS].before.contains(fn)).to.equal(true);
  });


  it("stores a [after] handler", () => {
    const fn = () => 0;
    const  result = server.after(fn);
    expect(result).to.equal(server);
    expect(server[HANDLERS].after.contains(fn)).to.equal(true);
  });


  describe("invoking", function() {
    beforeEach(() => {
      server.methods({
        "foo": (p1, p2) => { return 123 } ,
        "foo/bar": () => {},
        "fails": function() {
          this.throw(404, "Thing not found");
        }
      });
    });

    it("invokes with a self that is the same as the [e] arguments", () => {
      let e, self;
      server.before(function(args) {
        e = args;
        self = this;
      });
      server.methods.foo.get();
      expect(self).not.to.equal(undefined);
      expect(self).to.equal(e);
    });

    it("invokes the [before] handler", () => {
      let e;
      server.before(function(args) { e = args; });
      server.methods.foo.put("one", 2);
      expect(e.args).to.eql(["one", 2]);
      expect(e.verb).to.equal("PUT");
      expect(e.name).to.equal("foo");
      expect(e.url).to.equal("/foo");

      server.methods.foo.bar.get();
      expect(e.args).to.eql([]);
      expect(e.verb).to.equal("GET");
      expect(e.name).to.equal("foo/bar");
      expect(e.url).to.equal("/foo/bar");
    });

    it("invokes the [after] handler", () => {
      let e;
      server.after(function(args) { e = args; });
      server.methods.foo.put("one", 2)
      .then((result) => {
          expect(e.args).to.eql(["one", 2]);
          expect(e.verb).to.equal("PUT");
          expect(e.name).to.equal("foo");
          expect(e.url).to.equal("/foo");
          expect(e.result).to.equal(123);
          expect(e.error).to.equal(undefined);
      });
    });

    it("reports error from failed method", () => {
      let beforeArgs, afterArgs;
      server.before(function(args) { beforeArgs = args; });
      server.after(function(args) { afterArgs = args; });
      server.methods.fails.get()
      .catch((err) => {
        expect(afterArgs.error).to.equal(err);
        expect(afterArgs.result).to.equal(undefined);
      });
      expect(beforeArgs.name).to.equal("fails");
      expect(beforeArgs.error).to.equal(undefined);
    });

    it("throws an error from the [before] handler", (done) => {
      let e;
      server.before(function(args) {
        this.throw(404, "Thing not found!");
      });
      server.methods.foo.put(1, 2)
      .catch((err) => {
          expect(err.status).to.equal(404);
          expect(err.method).to.equal("foo");
          expect(err.args).to.eql([1, 2]);
          expect(err.message).to.equal("Thing not found!");
          done();
      });
    });


    it("the context of the [after] handler does not have a [throw] method", (done) => {
      server.after(function(e) {
        expect(e.throw).to.equal(undefined);
        done();
      });
      server.methods.foo.put(1, 2);
    });

  });
});
