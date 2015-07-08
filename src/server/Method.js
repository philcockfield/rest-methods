import _ from 'lodash';



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
  }
}
