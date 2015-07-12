import _ from 'lodash';
import MethodProxy from './MethodProxy';
import util from 'js-util';
import Promise from 'bluebird';
import { Handlers } from 'js-util';
import { BASE_URL } from '../const';

const readyHandlers = new Handlers();
export const state = {
  methods: {},
  queue: []
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
    state.queue = [];
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
  call(methodName, ...args) { return this.apply(methodName, args); },


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

    if (!this.isReady) {
      // Queue up the method for eventual execution.
      return new Promise((resolve, reject) => {
          state.queue.push({
            methodName: methodName,
            args: args,
            resolve: resolve,
            reject: reject
          });
      });

    } else {
      // Invoke the method.
      let method = state.methods[methodName];
      if (!method) { throw new Error(`Method '${ methodName }' does not exist.`); }
      return method.invoke(args);
    }
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

  // Invoke stored queue of methods that were registered
  // prior to the manifest being returned from the server.
  api.isReady = true;
  if (state.queue.length > 0) {
    let queue = _.clone(state.queue);
    state.queue = [];
    queue.forEach((item) => {
        api.apply(item.methodName, item.args)
        .then((result) => { item.resolve(result); })
        .catch((err) => { item.reject(err); });
    });
  }

  // Finish up.
  readyHandlers.invoke();
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
