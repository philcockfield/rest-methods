import _ from "lodash";
import { METHODS } from "../const";


const mergeParameterDocs = (paramsArray, methodDocs) => {
    paramsArray = _.clone(paramsArray, true);
    for (let item of paramsArray) {
      let details = methodDocs.params[item.name];
      if (details) {
        item.description = details.description;
        item.type = details.type;
      }
    }
    return paramsArray;
};



/**
  * Generates the manifest of currently registered methods
  * for delivery over the wire to clients.
  * @return {object}.
  */
export const getMethods = (server, options = {}) => {
  if (!server) { throw new Error("getMethods: [server] not sepcified."); }
  let result = {};
  let methods = server[METHODS];

  const formatMethod = (key, method) => {
      if (_.isEmpty(method)) { return; }
      let methodDefinition = {
        url: undefined,
        name: key.replace(/\//g, ".")
      };
      result[key] = methodDefinition;
      ["get", "put", "post", "delete"].map((verb) => {
          let methodVerb = method[verb];
          if (methodVerb) {
            let verbDefiniton = methodDefinition[verb] = {};
            if (options.docs && methodVerb.docs && methodVerb.docs.description ) { methodDefinition.description = methodVerb.docs.description; }
            if (methodVerb.route.path) { methodDefinition.url = methodVerb.route.path; }

            // Params.
            let params = _.clone(methodVerb.params);
            if (verb === "get" || verb === "delete") {
              // Prune of parameters that are not on the URL for GET|DELETE verbs.
              params = _.filter(params, (param) => {
                  return _.any(methodVerb.route.keys, (routeKey) => {
                    return param.name === routeKey.name;
                  });
              });
            }
            if (!_.isEmpty(params)) {
              verbDefiniton.params = params;
              if (options.docs && methodVerb.docs) {
                verbDefiniton.params = mergeParameterDocs(verbDefiniton.params, methodVerb.docs);
              }
            }
          }
      });
  };

  Object.keys(methods).forEach(key => { formatMethod(key, methods[key]); });
  return result;
};



export default (server, options = {}) => {
  return {
    name: server.name,
    version: server.version || "0.0.0",
    basePath: server.basePath,
    methods: getMethods(server, options)
  };
};
