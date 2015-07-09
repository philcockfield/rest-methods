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
  invoke() {
    // args = []
  }

}
