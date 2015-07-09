import _ from 'lodash';
import { Handlers } from 'js-util';
import state from './state';
import MethodProxy from './MethodProxy';
const readyHandlers = new Handlers();


/**
* The proxy to the server methods.
*/
export default {
  isReady: false,


  /**
  * Registers a callback to be invoked when the server-proxy is ready.
  * @param func: The callback function.
  */
  onReady(func) {
    readyHandlers.push(func);
    return this;
  },


  /**
  * Initalizes the proxy with the server methods.
  * @param methods: An object containing the method definitions from the server.
  */
  registerMethods(methods = {}) {
    // Store methods.
    _.keys(methods).forEach((key) => {
      state.methods[key] = new MethodProxy(key, methods[key].params);
    });

    // Finish up.
    readyHandlers.invoke();
    this.isReady = true;
    return this;
  },


  /**
  * Invokes the specified method taking parameters.
  *
  * @param methodName: The name/key of the method to invoke.
  * @param args: Optional. The arguments to pass to the method.
  *
  * @return promise.
  */
  call(methodName, ...args) {
    let method = state.methods[methodName];
    if (!method) { throw new Error(`Method '${ methodName }' does not exist.`); }
    return method.invoke(args);
  },


  /**
  * Invokes the specified method taking an array of parameters.
  *
  * @param methodName: The name/key of the method to invoke.
  * @param args: Optional. The arguments to pass to the method.
  *
  * @return promise.
  */
  apply(methodName, args = []) {
    if (!_.isArray(args)) { args = [args]; }
    let method = state.methods[methodName];
    if (!method) { throw new Error(`Method '${ methodName }' does not exist.`); }
    return method.invoke(args);
  }
};
