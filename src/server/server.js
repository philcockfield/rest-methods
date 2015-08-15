import _ from "lodash";
import bodyParser from "body-parser";
import ServerMethod from "./ServerMethod";
import middleware from "./middleware";
import connectModule from "connect";
import pageJS from "../page-js";
import { METHODS, HANDLERS } from "../const";
import http from "http";
import chalk from "chalk";
import * as util from "js-util";
import { getMethodUrl } from "../url";


/**
* Generates a standard URL for a method.
*
* @param basePath:  The base path to prefix the URL with.
* @param path:      The main part of the URL.
*
* @return string.
*/
const methodUrl = (basePath, path) => {
  path = path.replace(/^\/*/, "");
  let url = `${ basePath }/${ path }`;
  url = "/" + url.replace(/^\/*/, "");
  return url;
};



/**
  * Represents a REST API server.
  */
class Server {
  /**
    * Constructor
    *
    * @param connect: The connect app to apply the middleware to.
    * @param options:
    *           - name:     The name of the service.
    *           - connect:  The connect app to use.
    *                       If not specified a default Connect server is created.
    *           - basePath: The base path to prepend URL"s with.
    *           - version:  The version number of the service.
    */
  constructor(options = {}) {
    // Store state.
    this.name = options.name || "Server Methods";
    this.version = options.version || "0.0.0";
    this[METHODS] = {};
    this[HANDLERS] = {
      before: new util.Handlers(),
      after: new util.Handlers()
    };

    // Store base path.
    let path = options.basePath;
    if (_.isString(path)) {
      path = path.replace(/^\/*/, "").replace(/\/*$/, "");
    } else {
      path = "";
    }
    this.basePath = `/${ path }`;

    // Register middleware.
    let connect = options.connect;
    if (!connect) {
      connect = connectModule();
    }
    connect.use(bodyParser.json());
    connect.use(middleware(this));
    this.connect = connect;

    /**
    * Registers or retrieves the complete set of methods.
    *
    * @param definition: An object containing the method definitions.
    * @return an object containing the set of method definitions.
    */
    this.methods = (definition) => {
      // Write: store method definitions if passed.
      if (definition) {
        const createUrl = (urlPath, methodDef) => {
            return methodUrl(this.basePath, (methodDef.url || urlPath));
        };

        Object.keys(definition).forEach((key) => {
            let methods = this[METHODS];
            if (methods[key]) { throw new Error(`Method "${ key }" already exists.`); }

            let value = definition[key];
            let url = createUrl(key, value);
            let methodSet;
            if (_.isFunction(value)) {
              // A single function was provided.
              // Use it for all the HTTP verbs.
              let func = value;
              methodSet = {
                get: new ServerMethod(key, func, url, "GET"),
                put: new ServerMethod(key, func, url, "PUT"),
                post: new ServerMethod(key, func, url, "POST"),
                delete: new ServerMethod(key, func, url, "DELETE")
              };

            } else if(_.isObject(value)) {
              // Create individual methods for each verb.
              methodSet = {};
              if (value.get) { methodSet.get = new ServerMethod(key, value.get, url, "GET", value.docs); }
              if (value.put) { methodSet.put = new ServerMethod(key, value.put, url, "PUT", value.docs); }
              if (value.post) { methodSet.post = new ServerMethod(key, value.post, url, "POST", value.docs); }
              if (value.delete) { methodSet.delete = new ServerMethod(key, value.delete, url, "DELETE", value.docs); }

            } else {
              throw new Error(`Type of value for method "${ key }" not supported. Must be function or object.`);
            }

            // Store an pointer to the method.
            // NOTE:  This allows the server and client to behave isomorphically.
            //        Server code can call the methods (directly) using the same
            //        pathing/namespace object that the client uses, for example:
            //
            //              server.methods.foo.put(123, "hello");
            //
            let stub = util.ns(this.methods, key, { delimiter: "/" });
            ["get", "put", "post", "delete"].forEach((verb) => {
                    const method = methodSet[verb];
                    if (method) {
                      stub[verb] = function(...args) {

                        // Prepare the URL for the method.
                        const route = method.route;
                        const totalUrlParams = route.keys.length;
                        const invokeUrl = getMethodUrl(method.name, null, route, args);
                        if (totalUrlParams > 0) {
                          args = _.clone(args);
                          // args.splice((args.length - totalUrlParams) , totalUrlParams);
                          args.splice(0, totalUrlParams);
                        }

                        // Invoke the method.
                        return method.invoke(args, invokeUrl);
                      };
                    }
            });

            // Store the values.
            this[METHODS][key] = methodSet;
        });
      }
      // Read.
      return this[METHODS];
    };

    // Finish up (Constructor).
    return this;
  }


  /**
   * Registers a handler to invoke BEFORE a server method is invoked.
   * @param {Function} func(arg): The function to invoke.
   */
  before(func) {
    this[HANDLERS].before.push(func);
    return this;
  }

  /**
   * Registers a handler to invoke AFTER a server method is invoked.
   * @param {Function} func(arg): The function to invoke.
   */
  after(func) {
    this[HANDLERS].after.push(func);
    return this;
  }


  /**
   * Determines whether the given URL path matches any of
   * the method routes.
   * @param url:  {string} The URL path to match.
   * @param verb: {string} The HTTP verb to match (GET|PUT|POST|DELETE).
   * @return {ServerMethod}
   */
  match(url, verb) {
    verb = verb.toLowerCase();
    const context = new pageJS.Context(url);
    const methods = this[METHODS];
    const methodNames = Object.keys(methods);
    if (!_.isEmpty(methodNames)) {
      let methodName = _.find(Object.keys(methods), (key) => {
          let methodVerb = methods[key][verb];
          let isMatch = (methodVerb && methodVerb.pathRoute.match(context.path, context.params));
          return isMatch;
      });
      var method = methods[methodName];
    }
    return method ? method[verb] : undefined;
  }



  /**
    * Starts the server.
    * Only use this if you"re not passing in a connect server that
    * you are otherwise starting/managing independely for other purposes.
    * @param options:
    *             - port: The HTTP port to use.
    * @return
    */
  start(options = {}) {
    const PORT = options.port || 3030;

    // Start the server.
    http.createServer(this.connect).listen(PORT);

    // Output some helpful details to the console.
    const HR = chalk.cyan(_.repeat("-", 80));
    let ADDRESS = `localhost:${ PORT }`;
    if (!this.basePath !== "/") { ADDRESS += this.basePath; }
    console.log("");
    console.log(HR);
    console.log(`${ chalk.grey("Running") } ${ chalk.black(this.name) } ${ chalk.grey(`(${ this.version }) on`) } ${ chalk.cyan(ADDRESS) }`);
    console.log(HR);
    console.log("");

    // Finish up.
    return this;
  }
}


// ----------------------------------------------------------------------------
export default (options) => { return new Server(options); };
