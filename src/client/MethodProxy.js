import { BASE_URL } from '../const';
import Promise from 'bluebird';
import { xhr } from 'js-util';



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
  invoke(...args) {
    return new Promise((resolve, reject) => {
        let payload = {
          method: this.name,
          args: args
        };
        xhr.post(`/${ BASE_URL }/invoke`, payload)
        .then((result) => { resolve(result); })
        .catch((err) => { reject(err); });
    });
  }
}
