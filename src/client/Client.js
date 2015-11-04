import _ from "lodash";
import ClientMethod from "./ClientMethod";
import * as util from "js-util";
import xhr from "http-promises/browser";
import { Handlers } from "js-util";
import { MANIFEST_PATH } from "../const";

export const STATE = Symbol("state");
const isBrowser = (typeof window !== "undefined" && window !== null);



/**
* Initalizes the proxy with the server methods.
* @param {Client} client:  The Client proxy to the server.
* @param {object} methodsManifest: An object containing the method definitions from the server.
*                                  NB: The the [methods] object form the manifest.
*/
export const registerMethods = (client, methodsManifest = {}) => {
  const { host, http } = client[STATE];

  // Store methods.
  Object.keys(methodsManifest).forEach((key) => {
      let options = methodsManifest[key];
      options.host = host;
      let method = new ClientMethod(key, http, options);
      client[STATE].methods[key] = method;

      // Create proxy-stubs to the method.
      let stub = util.ns(client.methods, key, { delimiter: "/" });
      Object.keys(method.verbs).forEach(verb => {
          stub[verb] = (...args) => { return method.invoke(verb, args); };
      });
  });

  // Invoke ready handlers.
  client.isReady = true;
  client[STATE].readyHandlers.invoke();
  client[STATE].readyHandlers = new Handlers(); // Reset.
};







/**
 * The client proxy to server methods.
 */
class Client {
  /**
   * Constructor.
   * Initializes the module client-side, pulling the
   * manifest of methods from the server.
   * @param options
   *          - http: The HTTP object to use for making requests.
   *          - host: The host-name of the remote server,
   *                  For example:
   *                      - http://domain.com
   *                      - localhost:3030
   */
  constructor(options = {}) {
    // Private field: HTTP.
    let http = options.http;
    if (isBrowser && !http) { http = xhr; }
    if (!http) { throw new Error("An [http] gateway was not given to the [Client]."); }

    // Private field: Host.
    let host = options.host;
    if (!isBrowser && !host) { throw new Error("A [host] name must be given when connecting a server to a remove server (eg. https://domain.com, or localhost:3030) "); }
    if (host) {
      if (!host.startsWith("http")) { host = `http://${ host }`; }
      host = host.replace(/\/*$/, "");
    }

    // Private field: State.
    this[STATE] = {
      methods: {},
      readyHandlers: new Handlers(),
      http: http,
      host: host
    };

    /**
    * Flag indicating the ready state of the client.
    * Is true after `init` has retrieved methods from the server.
    */
    this.isReady = false;

    /**
    * An object containing proxy"s to server methods.
    * This object is populated after initialization completes.
    */
    this.methods = {};

    // Connect to the server.
    let url = MANIFEST_PATH;
    if (!isBrowser && host) { url = `${ host }${ url }`; }
    http.get(url)
      .then((result) => { registerMethods(this, result.data.methods); })
      .catch((err) => { throw err; });
  }


  /**
  * Registers a callback to be invoked when the server-proxy is ready.
  * @param func: The callback function.
  */
  onReady(func) {
    if (this.isReady) {
      // Already initialized - invoke callback immediately.
      if (_.isFunction(func)) {
        func();
      }
    } else {
      // Store callback to invoke later.
      this[STATE].readyHandlers.push(func);
    }
    return this;
  }


  /**
  * Invokes the specified method taking an array of parameters.
  *
  * @param verb: The HTTP verb (GET/PUT/POST/DELETE).
  * @param methodName: The name/key of the method to invoke.
  * @param args: Optional. The arguments to pass to the method.
  *
  * @return promise.
  */
  invoke(verb, methodName, args = []) {
    // Setup initial conditions.
    if (!_.isArray(args)) { args = [args]; }
    if (!this.isReady) {
      throw new Error(`Initializion must be complete before invoking methods.  See "isReady" flag.`);
    }

    // Invoke the method.
    let method = this[STATE].methods[methodName];
    if (!method || !method.verbs[verb.toLowerCase()]) {
      throw new Error(`Failed to invoke. A ${ verb } method "${ methodName }" does not exist.`);
    }
    return method.invoke(verb, args);
  }

  // HTTP verb specific invoker methods.
  get(methodName, ...args) { return this.invoke("GET", methodName, args); }
  put(methodName, ...args) { return this.invoke("PUT", methodName, args); }
  post(methodName, ...args) { return this.invoke("POST", methodName, args); }
  delete(methodName, ...args) { return this.invoke("DELETE", methodName, args); }
}



// ----------------------------------------------------------------------------
export default (options) => { return new Client(options); };
