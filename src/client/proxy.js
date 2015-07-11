import _ from 'lodash';
import MethodProxy from './MethodProxy';
import util from 'js-util';
import Promise from 'bluebird';
import { Handlers } from 'js-util';
import { BASE_URL } from '../const';

const readyHandlers = new Handlers();
export const state = {
  methods: {}
};


/**
* The proxy to the server methods.
*/
const api = {
  isReady: false,


  /**
  * Resets the proxy to it's uninitialized state.
  * NB: Used for testing.
  */
  reset() {
    this.isReady = false;
    state.methods = {};
  },


  /**
  * Registers a callback to be invoked when the server-proxy is ready.
  * @param func: The callback function.
  */
  onReady(func) {
    if (api.isReady) {
      // Already initialized - invoke callback immediately.
      if (_.isFunction(func)) {
        func();
      }
    } else {
      // Store callback to invoke later.
      readyHandlers.push(func);
    }
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



/**
* Initalizes the proxy with the server methods.
* @param methods: An object containing the method definitions from the server.
*/
export const registerMethods = (methods = {}) => {

  // Store methods.
  _.keys(methods).forEach((key) => {
    state.methods[key] = new MethodProxy(key, methods[key].params);
  });

  // Finish up.
  readyHandlers.invoke();
  api.isReady = true;
  return this;
};



/**
* Initializes the module client-side, pulling the manifest
* of methods from the server.
*/
export const init = () => {
  return new Promise((resolve, reject) => {
      util.xhr.get(`/${ BASE_URL }/manifest`)
      .then((result) => {
          registerMethods(result.methods);
          resolve();
      })
      .catch((err) => reject(err));
  });
};


export default api;
