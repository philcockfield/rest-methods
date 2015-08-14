import { expect } from "chai";
import * as util from "js-util";
import { HANDLERS } from "../../src/const";
import Server from "../../src/server/server";


describe.only("Before/After Hooks", function() {
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
});
