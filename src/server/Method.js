import _ from 'lodash';
import util from 'js-util';


/**
* Represents a method.
*/
export default class Method {
  constructor(name, func) {
    // Setup initial conditions.
    if (_.isEmpty(name)) { throw new Error(`Method name not specified.`); }
    if (!_.isFunction(func)) { throw new Error(`Function not specified for the method '${ name }'.`); }

    // Store state.
    this.name = name;
    this.func = func;
    this.params = util.functionParameters(func);
  }

  /**
  * Invokes the method function.
  *
  * @param req:  The request object.
  * @param args: An array of arguments.
  * @return promise.
  */
  invoke(req, args) {
    return new Promise((resolve, reject) => {

      const rejectWithError = (err) => {
        err = new Error(`Failed while executing '${ this.name }': ${ err.message }`);
        reject(err);
      };

      // Attempt to invoke the function.
      try {
        let thisContext = {};
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
