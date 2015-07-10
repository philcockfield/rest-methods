import { BASE_URL } from '../const';
import Promise from 'bluebird';
import http from './http.js';



class MethodError extends Error {
  constructor(method, message, err) {
    super(message);
  }
}



/**
* Represents a proxy to a single method on the server.
*/
export default class MethodProxy {
  constructor(name, params = []) {
    this.name = name;
    this.params = params;
  }


  /**
  * Invokes the method on the server.
  * @param args: An array of arguments.
  * @return promise.
  */
  invoke(args = []) {
    return new Promise((resolve, reject) => {
        let payload = {
          name: this.name,
          args: args
        };

        http.post(`/${ BASE_URL }/invoke`, payload, (err, result) => {
          if (err) {
            reject(new MethodError(this, 'Failed while executing method', err));
          } else {
            resolve(result);
          }
        });
    });
  }
}
