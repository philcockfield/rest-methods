import { expect } from "chai";
import MethodDocs from "../../src/server/MethodDocs";


describe("Server:MethodDocs", () => {
  it("has no values", () => {
    let docs = new MethodDocs();
    expect(docs.description).to.equal(undefined);
    expect(docs.params).to.eql({});
  });


  it("has a description with no parameters", () => {
    let docs = new MethodDocs(" Hello World  ");
    expect(docs.description).to.equal("Hello World");
    expect(docs.params).to.eql({});
  });


  it("has a multi-line description (trimmed)", () => {
    let msg =
      `  Foo
      Bar
      Baz

      `;
    expect(new MethodDocs(msg).description).to.equal("Foo\nBar\nBaz");
  });


  it("has a description and parameters", () => {
    let msg =
      `My
      Thing

      @param {string} text: The thing.
      @param { boolean   } isEnabled  -  Determines - if
                                   the thing is enabled.

      @param

      @param foo: With no type.
      @param bar

      `;

    let docs = new MethodDocs(msg);
    let params = docs.params;
    expect(docs.description).to.equal("My\nThing");

    expect(params.text.name).to.equal("text");
    expect(params.text.type).to.equal("string");
    expect(params.text.description).to.equal("The thing.");

    expect(params.isEnabled.name).to.equal("isEnabled");
    expect(params.isEnabled.type).to.equal("boolean");
    expect(params.isEnabled.description).to.equal("Determines - if the thing is enabled.");

    expect(params.foo.name).to.equal("foo");
    expect(params.foo.type).to.equal(undefined);
    expect(params.foo.description).to.equal("With no type.");

    expect(params.bar).to.equal(undefined);
  });
});
