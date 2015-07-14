import _ from 'lodash';
import { BASE_MODULE_PATH } from '../const';
import Promise from 'bluebird';
import { xhr } from 'js-util';



/**
* Represents a proxy to a single method on the server.
*/
export default class ClientMethod {
  /**
  * Constructor.
  * @param name: The unique name of the method.
  * @param options:
  *           - url: The method's URL path/pattern.
  *           - get: Definition of the GET function, eg. { params:['text', 'number'] }
  *           - put:     ..
  *           - post:    ..
  *           - delete:  ..
  */
  constructor(name, options = {}) {
    this.name = name;
    this.verbs = {};
    this.urlPattern = options.url || '/';

    // Store individual invoker methods for each HTTP verb.
    ['get', 'put', 'post', 'delete'].forEach(verb => {
        if (options[verb]) {
          this.verbs[verb] = options[verb];
        }
    });
  }


  /**
  * The URL to the method's resource.
  */
  url() {
    return this.urlPattern;
  }


  /**
  * Invokes the method on the server.
  * @param verb: The HTTP verb (GET | PUT | POST | DELETE)
  * @param args: An array of arguments.
  * @return promise.
  */
  invoke(verb = 'GET', ...args) {
    verb = verb.toUpperCase();
    return new Promise((resolve, reject) => {
        let payload = {
          verb: verb,
          method: this.name,
          args: _.flatten(args)
        };

        let xhrMethod = xhr[verb.toLowerCase()];
        xhrMethod(this.url(), payload)
            .then((result) => { resolve(result); })
            .catch((err) => { reject(err); });
    });
  }
}
