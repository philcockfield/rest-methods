import { expect } from "chai";
import pageJS from "../src/page-js";
import { getUrlParams } from "../src/url";



describe("Shared:Url", () => {
  describe("getUrlParams()", () => {
    it("has no params", () => {
      let route = new pageJS.Route("/foo");
      expect(getUrlParams(route, "/foo")).to.eql([]);
    });


    it("has params from path", () => {
      let route = new pageJS.Route("/foo/:id/:action");
      let result = getUrlParams(route, "/foo/123/edit");
      expect(result.length).to.equal(2);
      expect(result[0]).to.equal(123);
      expect(result[1]).to.equal('edit');
      expect(result.id).to.equal(123);
      expect(result.action).to.equal('edit');
    });


    it("has params from query-string (single)", () => {
      let route = new pageJS.Route("/foo?take=:take");
      let result = getUrlParams(route, "/foo?take=10");
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal(10);
      expect(result.take).to.equal(10);
    });


    it("has params from query-string (double)", () => {
      let route = new pageJS.Route("/foo?take=:take&skip=:skip");
      let result = getUrlParams(route, "/foo?take=10&skip=5");
      expect(result.length).to.equal(2);
      expect(result[0]).to.equal(10);
      expect(result[1]).to.equal(5);
      expect(result.take).to.equal(10);
      expect(result.skip).to.equal(5);
    });


    it("has params from path and query-string", () => {
      let route = new pageJS.Route("/foo/:action?take=:take&skip=:skip");
      let result = getUrlParams(route, "/foo/edit?take=10&skip=5");
      expect(result.length).to.equal(3);
      expect(result[0]).to.equal("edit");
      expect(result[1]).to.equal(10);
      expect(result[2]).to.equal(5);
      expect(result.action).to.equal("edit");
      expect(result.take).to.equal(10);
      expect(result.skip).to.equal(5);
    });

    describe("types", () => {
      it("converts to number", () => {
        let route = new pageJS.Route("/:value");
        expect(getUrlParams(route, "/123")[0]).to.equal(123);
      });
      it("converts to boolean", () => {
        let route = new pageJS.Route("/:value");
        expect(getUrlParams(route, "/true")[0]).to.equal(true);
        expect(getUrlParams(route, "/false")[0]).to.equal(false);
      });
      it("does not convert to boolean (when capitalized)", () => {
        let route = new pageJS.Route("/:value");
        expect(getUrlParams(route, "/True")[0]).to.equal('True');
        expect(getUrlParams(route, "/False")[0]).to.equal('False');
      });

    });
  });
});
