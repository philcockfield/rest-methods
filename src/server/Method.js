import _ from 'lodash';
import util from 'js-util';
import pageJS from './page-js';



/**
* Represents a method.
*/
export default class Method {
  constructor(name, func, routePath, verb) {
    // Setup initial conditions.
    if (_.isEmpty(name)) { throw new Error(`Method name not specified.`); }
    if (!_.isFunction(func)) { throw new Error(`Function not specified for the method '${ name }'.`); }
    if (_.isEmpty(routePath)) { throw new Error(`URL pattern not specified for the method '${ name }'.`); }
    if (_.isEmpty(verb)) { throw new Error(`HTTP verb not specified for the method '${ name }'.`); }

    // Store state.
    this.name = name;
    this.func = func;
    this.params = util.functionParameters(func);
    this.route = new pageJS.Route(routePath);
    this.verb = verb;
  }

  /**
  * Invokes the method function.
  *
  * @param req:  The request object.
  * @param args: An array of arguments.
  * @return promise.
  */
  invoke(args) {
    return new Promise((resolve, reject) => {
        const rejectWithError = (err) => {
            err = new Error(`Failed while executing '${ this.name }': ${ err.message }`);
            reject(err);
        };

        // Attempt to invoke the function.
        try {
          let thisContext = {
            verb: this.verb
          };
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
