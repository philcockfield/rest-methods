import _ from 'lodash';
import state from './state';
import pageJS from '../page-js';


/**
  * Generates the manifest of currently registered methods
  * for delivery over the wire to clients.
  * @return {object}.
  */
export const getMethods = () => {
  let result = {};
  Object.keys(state.methods).forEach(key => {
      let method = state.methods[key];
      let methodDefinition = {};
      result[key] = methodDefinition;
      ['get', 'put', 'post', 'delete'].map((verb) => {
          let methodVerb = method[verb];
          if (methodVerb) {
            let verbDefiniton = methodDefinition[verb] = {};
            if (methodVerb.route.path) { methodDefinition.url = methodVerb.route.path; }
            if (methodVerb.params) { verbDefiniton.params = methodVerb.params; }
          }
      });
  });
  return result;
};


export default () => {
  return {
    version: state.version || '0.0.0',
    basePath: state.basePath,
    methods: getMethods()
  };
};
