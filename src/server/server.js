import _ from 'lodash';
import bodyParser from 'body-parser';
import Method from './ServerMethod';
import state from './state';
import middleware from './middleware';

let isInitialized = false;
let queuedMethodDefinitions = [];


/**
* Generates a standard URL for a method.
*
* @param basePath:  The base path to prefix the URL with.
* @param path:      The main part of the URL.
*
* @return string.
*/
const methodUrl = (basePath, path) => {
  path = path.replace(/^\/*/, '');
  let url = `${ basePath }/${ path }`;
  url = '/' + url.replace(/^\/*/, '');
  return url;
};



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
  *           - version:  The version number of the service.
  */
  init(connect, options = {}) {
    if (isInitialized) { throw new Error('Already initialized.'); }
    if (!connect) { throw new Error('Failed to initialize. Connect app not specified.'); }

    // Store base path.
    let path = options.basePath;
    if (_.isString(path)) {
      path = path.replace(/^\/*/, '').replace(/\/*$/, '');
    } else {
      path = '';
    }
    state.basePath = `/${ path }`;

    // Store state.
    state.version = options.version;

    // Register middleware.
    connect.use(bodyParser.json());
    connect.use(middleware());

    // Register any pending methods that have been queued.
    //
    // NB: Methods are prevented from being registered until the module
    //     is initialized to ensure their route paths are correct.
    //     This allows method to be registered at any time prior to initialization.
    isInitialized = true;
    if (queuedMethodDefinitions.length > 0) {
      queuedMethodDefinitions.forEach(def => { this.methods(def) });
    }

    // Finish up.
    return this;
  },


  /**
  * Resets the server to an uninitialized state.
  */
  reset() {
    state.reset();
    isInitialized = false;
    queuedMethodDefinitions = [];
    return this;
  },



  /**
  * Registers or retrieves the complete set of methods.
  *
  * @param definition: An object containing the method definitions.
  * @return an object containing the set of method definitions.
  */
  methods(definition) {
    if (!isInitialized && definition) {
      queuedMethodDefinitions.push(definition);
    }

    // Write: store method definitions if passed.
    if (isInitialized && definition) {
      const createUrl = (path, methodDef) => {
          return methodUrl(state.basePath, (methodDef.url || path));
      };

      _.keys(definition).forEach((key) => {
          let methods = state.methods;
          if (methods[key]) { throw new Error(`Method '${ key }' already exists.`); }

          let value = definition[key];
          let url = createUrl(key, value);
          let methodSet;
          if (_.isFunction(value)) {
            // A single function was provided.
            // Use it for all the HTTP verbs.
            let func = value;
            let funcNoParams = function() { return func.call(this); };
            methodSet = {
              get: new Method(key, funcNoParams, url, 'GET'),
              put: new Method(key, func, url, 'PUT'),
              post: new Method(key, func, url, 'POST'),
              delete: new Method(key, funcNoParams, url, 'DELETE')
            }
          } else if(_.isObject(value)) {

            // Create individual methods for each verb.
            methodSet = {};
            if (value.get) { methodSet.get = new Method(key, value.get, url, 'GET'); }
            if (value.put) { methodSet.put = new Method(key, value.put, url, 'PUT'); }
            if (value.post) { methodSet.post = new Method(key, value.post, url, 'POST'); }
            if (value.delete) { methodSet.delete = new Method(key, value.delete, url, 'DELETE'); }

          } else {
            throw new Error(`Type of value for method '${ key }' not supported. Must be function or object.`);
          }

          // Store the values.
          state.methods[key] = methodSet;
      });
    }

    // Read.
    return state.methods;
  }
};
