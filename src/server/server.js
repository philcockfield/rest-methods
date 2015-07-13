import _ from 'lodash';
import bodyParser from 'body-parser';
import Method from './Method';
import state from './state';
import middleware from './middleware';
import { methodUrl } from '../util';

let isInitialized = false;


/**
* API for registering methods.
*/
export default {
  /**
  * Initializes the server module.
  *
  * @param connect: The connect app to apply the middleware to.
  * @param options:
  *           - basePath: The base path to prepend URL's with.
  */
  init(connect, options = {}) {
    if (isInitialized) { throw new Error('Already initialized.'); }

    // Store base path.
    let path = options.basePath;
    if (_.isString(path)) {
      path = path.replace(/^\/*/, '').replace(/\/*$/, '');
    } else {
      path = '';
    }
    state.basePath = `/${ path }`;

    // Register middleware.
    connect.use(bodyParser.json());
    connect.use(middleware());

    // Finish up.
    isInitialized = true;
    return this;
  },


  /**
  * Resets the server to an uninitialized state.
  */
  reset() {
    state.reset();
    isInitialized = false;
    return this;
  },



  /**
  * Registers or retrieves the complete set of methods.
  *
  * @param definition: An object containing the method definitions
  *                    taking the form of:
  *
  *                       { 'name':func(err, result) }
  *
  * @return an object containing the set of method definitions.
  */
  methods(definition) {
    // Write: store method definitions if passed.
    if (definition) {
      const createUrl = (methodName, definition) => {

          let url = methodUrl(state.basePath, methodName);
          return url;

      };

      _.keys(definition).forEach((key) => {
          let methods = state.methods;
          if (methods.get(key)) { throw new Error(`Method '${ key }' already exists.`); }

          let value = definition[key];
          let methodSet;
          if (_.isFunction(value)) {
            // A single function was provided.
            // This will be used for all REST verbs.
            let method = new Method(key, value, createUrl(key, value));
            methodSet = {
              get: method,
              put: method,
              post: method,
              delete: method
            }
          } else if(_.isObject(value)) {

            // Create individual methods for each verb.
            let url = createUrl(key, value);
            methodSet = {};
            if (value.get) { methodSet.get = new Method(key, value.get, url); }
            if (value.put) { methodSet.put = new Method(key, value.put, url); }
            if (value.post) { methodSet.post = new Method(key, value.post, url); }
            if (value.delete) { methodSet.delete = new Method(key, value.delete, url); }

          } else {
            throw new Error(`Type of value for method '${ key }' not supported. Must be function or object.`);
          }

          // Store the values.
          state.methods = methods.set(key, methodSet);
      });
    }

    // Read.
    return state.methods.toObject();
  }
};
