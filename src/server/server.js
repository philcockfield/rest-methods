import _ from 'lodash';
import bodyParser from 'body-parser';
import Method from './Method';
import state from './state';
import middleware from './middleware';

let isInitialized = false;


/**
* API for registering methods.
*/
export default {
  /**
  * Initializes the server module.
  *
  * @param connect: The connect app to apply the middleware to.
  */
  init(connect) {
    if (isInitialized) { throw new Error('Already initialized.'); }
    connect.use(bodyParser.json());
    connect.use(middleware());
    isInitialized = true;
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
      _.keys(definition).forEach((key) => {
          let methods = state.methods;
          if (methods.get(key)) { throw new Error(`Method '${ key }' already exists.`); }

          let value = definition[key];
          let methodSet;
          if (_.isFunction(value)) {
            // A single function was provided.
            // This will be used for all REST verbs.
            let method = new Method(key, value);
            methodSet = {
              get: method,
              put: method,
              post: method,
              delete: method
            }
          } else if(_.isObject(value)) {

            // Create individual methods for each verb.
            methodSet = {};
            if (value.get) { methodSet.get = new Method(key, value.get); }
            if (value.put) { methodSet.put = new Method(key, value.put); }
            if (value.post) { methodSet.post = new Method(key, value.post); }
            if (value.delete) { methodSet.delete = new Method(key, value.delete); }

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
