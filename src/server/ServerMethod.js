import _ from "lodash";
import util from "js-util";
import pageJS from "../page-js";
import { ServerMethodError } from "../errors";
import MethodDocs from "./MethodDocs";
import { getUrlParams } from "../url";


/**
 * Represents a method.
 */
export default class ServerMethod {
  constructor(name, func, routePattern, verb, docs) {
    // Setup initial conditions.
    if (_.isEmpty(name)) { throw new Error(`Method name not specified.`); }
    if (util.isNumeric(name[0])) { throw new Error(`Method names cannot start with numbers. Given name: ${ name }`); }
    if (name.match(/^[a-zA-Z0-9-\/]*$/) === null) { throw new Error(`A method name can only contain alpha-numeric characters and '/' or '-'.  Given name: ${ name }`); }
    if (!_.isFunction(func)) { throw new Error(`Function not specified for the method "${ name }".`); }
    if (_.isEmpty(routePattern)) { throw new Error(`URL pattern not specified for the method "${ name }".`); }
    if (_.isEmpty(verb)) { throw new Error(`HTTP verb not specified for the method "${ name }".`); }

    // Store state.
    this.name = name;
    this.func = func;
    this.verb = verb;
    if (docs) { this.docs = new MethodDocs(docs); }

    // Store routes.
    this.route = new pageJS.Route(routePattern);
    this.pathRoute = new pageJS.Route(routePattern.split("?")[0]); // Route excluding the query-string pattern.
    const routeKeys = this.route.keys;

    // Calculate parameters.
    const params = util.functionParameters(func);
    if (params.length > 0) {
      this.params = params.map(paramName => {
        return { name: paramName };
      });
    }

    // If the URL route has parameters, ensure the function has enough parameters.
    if (routeKeys.length > 0 && params.length < routeKeys.length) {
      const routeParams = routeKeys.map(item => item.name).join(",");
      throw new Error(`The ${ verb } method "${ name }" does not have enough parameters based on the URL route "${ routePattern }". Should be: ${ name }(${ routeParams })`);
    }

    // Ensure URL params are represented within the function.
    if (routeKeys.length > 0) {
      let index = 0;
      routeKeys.forEach(item => {
        if (params[index] !== item.name) {
          throw new Error(`The "${ name }" method has a function parameter ("${ params[index] }") at index ${ index } that does not match the URL pattern. URL parameters come first.  The parameter should be "${ item.name }".`);
        }
        index += 1;
      });
    }
  }


  /**
   * Invokes the method function.
   *
   * @param args: An array of arguments.
   * @param url:  The requesting URL.
   * @return promise.
   */
  invoke(args, url) {
    return new Promise((resolve, reject) => {
        const rejectWithError = (err) => {
            err = new ServerMethodError(err.status, this.name, args, err.message);
            reject(err);
        };

        // Extract the URL parameters.
        const urlParams = getUrlParams(this.route, url);

        // Prepend the URL params to the arguments if there are any.
        if (urlParams.length > 0) {
          args = _.flatten([urlParams, args]);
        }

        let thisContext = {
          verb: this.verb,
          url: {
            path: url,
            params: urlParams
          },
          throw: (status, message) => { throw new ServerMethodError(status, this.name, args, message); }
        };

        // Attempt to invoke the function.
        try {
          let result = this.func.apply(thisContext, args);
          if (result && _.isFunction(result.then)) {
            // A promise was returned.
            result
              .then((asyncResult) => { resolve(asyncResult); })
              .catch((err) => { rejectWithError(err); });

          } else {
            // A simple value was returned.
            resolve(result);
          }

        } catch (err) { rejectWithError(err); }
    });
  }
}
