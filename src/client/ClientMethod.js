import _ from "lodash";
import Promise from "bluebird";
import { ServerMethodError } from "../errors";
import pageJS from "../page-js";
import { getMethodUrl } from "../url";


const parseError = (err) => {
  // Convert the [HttpError] into a [ServerMethodError].
  try {
    var { status, method, args, message } = JSON.parse(err.message);
  } catch (e) {
    // The server did not return JSON details about the method error.
    message = err.message;
  }
  return new ServerMethodError(status, method, args, message);
};




/**
 * Represents a proxy to a single method on the server.
 */
export default class ClientMethod {
  /**
   * Constructor.
   * @param name: The unique name of the method.
   * @param http: The HTTP object to use for making requests.
   * @param options:
   *           - host: The host-name of the remote server.
   *           - url: The method"s URL path/route-pattern.
   *           - get: Definition of the GET function, eg. { params:["text", "number"] }
   *           - put:     ..
   *           - post:    ..
   *           - delete:  ..
   */
  constructor(name, http, options = {}) {
    if (!http) { throw new Error("An [http] gateway was not given to the [ClientMethod]."); }

    // Prepare the URL.
    let url = options.url;
    if (!url) {
      // If a URL was not specified use the method name.
      url = `/${ name.replace(/^\/*/, "") }`;
    }

    // Store values.
    this.name = name;
    this.verbs = {};
    this.urlPattern = url;
    this.route = new pageJS.Route(this.urlPattern);
    this.http = http;
    this.host = options.host;

    // Store individual invoker methods for each HTTP verb.
    ["get", "put", "post", "delete"].forEach(verb => {
        if (options[verb]) {
          this.verbs[verb] = options[verb];
        }
    });
  }


  /**
   * The URL to the method"s resource.
   * @param args: Optional. An array of arguments.
   */
  url(...args) {
    return getMethodUrl(this.name, this.host, this.route, args);
  }


  /**
   * Invokes the method on the server.
   * @param verb: The HTTP verb (GET | PUT | POST | DELETE)
   * @param args: An array of arguments.
   * @return promise.
   */
  invoke(verb = "GET", ...args) {
    // Setup initial conditions.
    verb = verb.toUpperCase();
    args = _.flatten(args);
    args = _.compact(args);

    return new Promise((resolve, reject) => {
        // Prepare the URL.
        let url = this.url(args);
        const urlParamsTotal = this.route.keys.length;
        if (urlParamsTotal > 0) {
          // The URL contained parameters that were taken from the args.
          // Remove them from the set of arguments passed in the payload.
          args = _.clone(args);
          args = args.splice(urlParamsTotal, args.length);
        }

        if ((verb === "GET" || verb === "DELETE") && args.length > 0) {
          let msg = `Cannot send arguments to the "${ this.name }", REST does not allow you to submit data to a ${ verb } method.  Instead use the PUT or POST verbs.`;
          if (urlParamsTotal > 0) { msg += ` This method"s URL does, however, take parameters (${ this.urlPattern }).`; }
          throw new Error(msg);
        }

        // Setup the payload to send.
        let payload = {
          verb: verb,
          method: this.name,
          args: args
        };

        // Send to the server.
        let httpMethod = this.http[verb.toLowerCase()];
        httpMethod(url, payload)
            .then((result) => { resolve(result); })
            .catch((err) => {
                err = parseError(err);
                reject(err);
            });
    });
  }
}
