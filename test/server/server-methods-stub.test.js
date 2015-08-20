import { expect } from "chai";
import _ from "lodash";
import Server from "../../src/server/server";



describe("Server:stub-methods (executing on the server)", () => {
  let server;
  beforeEach(() => {
    server = Server({});
  });


  it("does not share methods function between instances", () => {
    let server1 = Server({});
    let server2 = Server({});
    expect(server1.methods).not.to.equal(server2.methods);
  });

  it("does not have a server method stub", () => {
    expect(server.methods.foo).to.equal(undefined);
  });


  it("has stubs for all HTTP verb", () => {
    server.methods({
      "foo": () => {}
    });
    expect(server.methods.foo.get).to.be.an.instanceof(Function);
    expect(server.methods.foo.put).to.be.an.instanceof(Function);
    expect(server.methods.foo.post).to.be.an.instanceof(Function);
    expect(server.methods.foo.delete).to.be.an.instanceof(Function);
  });


  it("has stubs for only declared verbs (none)", () => {
    server.methods({
      "foo": {}
    });
    expect(server.methods.foo.get).to.equal(undefined);
    expect(server.methods.foo.put).to.equal(undefined);
    expect(server.methods.foo.post).to.equal(undefined);
    expect(server.methods.foo.delete).to.equal(undefined);
  });


  describe("invoking each HTTP verb", () => {
    it("invokes the GET method no params", () => {
      let count = 0;
      server.methods({
        "foo":{ get: () => { count += 1; } }
      });
      server.methods.foo.get();
      expect(count).to.equal(1);
    });

    it("invokes the GET method with URL params", () => {
      let invoked = [];
      let self;
      server.methods({
        "foo":{
          url: "/foo/:id",
          get: function(id, thisWillBeStripped) {
            invoked.push(id);
            self = this;
          }
        }
      });
      server.methods.foo.get("my-id");
      expect(invoked).to.eql([ "my-id" ]); // Params not passed to GET method.
      expect(self.url.path).to.equal("/foo/my-id");
      expect(self.url.params.id).to.eql("my-id");
    });

    it("invokes the PUT/POST method with direct params", () => {
      let invoked = [];
      server.methods({
        "foo":{
          put: (number) => { invoked.push({ put: number }); },
          post: (number) => { invoked.push({ post: number }); }
        }
      });
      server.methods.foo.put(123);
      server.methods.foo.post(456);
      expect(invoked.length).to.equal(2);
      expect(invoked[0]).to.eql({ put:123 });
      expect(invoked[1]).to.eql({ post:456 });
    });

    it("invokes the PUT/POST method with URL params and direct params", () => {
      let invoked = [];
      server.methods({
        "foo":{
          url: "/foo/:id",
          put: (id, number) => { invoked.push({ id:id, number:number }); },
          post: (id, number) => { invoked.push({ id:id, number:number }); }
        }
      });
      server.methods.foo.put("my-put", 123);
      server.methods.foo.post("my-post", 456);
      expect(invoked.length).to.equal(2);
      expect(invoked[0]).to.eql({ id:"my-put", number:123 });
      expect(invoked[1]).to.eql({ id:"my-post", number:456 });
    });

    it("invokes the DELETE method without params", () => {
      let count = 0
      server.methods({
        "foo":{ delete: () => { count += 1; } }
      });
      server.methods.foo.delete();
      expect(count).to.equal(1);
    });
  });


  it("invokes the stub on a deep namespace", () => {
    let invoked = [];
    server.methods({
      "foo/bar/baz": (arg) => { invoked.push(arg) }
    });

    server.methods.foo.bar.baz.get("GET");
    server.methods.foo.bar.baz.put("PUT");
    server.methods.foo.bar.baz.post("POST");
    server.methods.foo.bar.baz.delete("DELETE");

    expect(invoked[0]).to.equal("GET");
    expect(invoked[1]).to.equal("PUT");
    expect(invoked[2]).to.equal("POST");
    expect(invoked[3]).to.equal("DELETE");
  });



  describe("promises", () => {
    it("resolves a promise", (done) => {
      server.methods({
        "foo": (number) => { return { number:number }; }
      });

      server.methods.foo.put(123)
      .then((result) => {
        expect(result).to.eql({ number:123 });
        done();
      });
    });


    it("handles a promise rejection via `.throw()`", (done) => {
      server.methods({
        "foo": function(number) { this.throw(404, "Fail!"); }
      });

      server.methods.foo.post(123)
      .catch((err) => {
        expect(err.message).to.equal("Fail!");
        expect(err.status).to.equal(404);
        done();
      });
    });
  });

});
