import { expect } from "chai";
import Server from "../../src/server/server";


describe("Server (instance)", () => {
  it("has no base path by default", () => {
    let server = Server();
    expect(server.basePath).to.equal("/");
  });


  it("initializes with a base URL path", () => {
    let server = Server({ basePath: "////api/////" });
    expect(server.basePath).to.equal("/api");
  });


  it("initializes with a version", () => {
    let server = Server();
    expect(server.version).to.equal("0.0.0");

    server = Server({ version:"1.2.3" });
    expect(server.version).to.equal("1.2.3");
  });


  it("has a default name", () => {
    let server = Server();
    expect(server.name).to.equal("Server Methods");
  });


  it("has the specified name", () => {
    let server = Server({ name:"My API" });
    expect(server.name).to.equal("My API");
  });


  it("shows docs by default", () => {
    let server = Server();
    expect(server.docs).to.equal(true);
  });


  it("does not show docs", () => {
    let server = Server({ docs:false });
    expect(server.docs).to.equal(false);
  });
});
