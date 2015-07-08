import _ from 'lodash';
import Method from './Method';
import state from './state';


/**
* API for registering methods.
*/
class Server {
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
    // Store method definitions if passed.
    if (definition) {
      _.keys(definition).forEach((key) => {
          let methods = state.methods;
          if (methods.get(key)) { throw new Error(`Method '${ key }' already exists.`); }
          state.methods = methods.set(key, new Method(key, definition[key]));
      });
    }

    // Finish up.
    return state.methods.toObject();
  }
}



// Export singleton.
export default new Server();
