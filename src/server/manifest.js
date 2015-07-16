import _ from 'lodash';
import pageJS from '../page-js';
import { METHODS } from '../const';


/**
  * Generates the manifest of currently registered methods
  * for delivery over the wire to clients.
  * @return {object}.
  */
export const getMethods = (server) => {
  if (!server) { throw new Error('getMethods: [server] not sepcified.'); }
  let result = {};
  let methods = server[METHODS];
  Object.keys(methods).forEach(key => {
      let method = methods[key];
      let methodDefinition = { url:undefined };
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



export default (server) => {
  return {
    version: server.version || '0.0.0',
    basePath: server.basePath,
    methods: getMethods(server)
  };
};
