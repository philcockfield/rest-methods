/**
* An error thrown while executing a server method.
*/
export class ServerMethodError extends Error {
  constructor(status, method, args, message) {
    super();
    this.status = status || 500;
    this.method = method;
    this.args = args || [];
    this.message = message;
  }
}
