import _ from 'lodash';
import bodyParser from 'body-parser';
import Method from './ServerMethod';
import middleware from './middleware';
import ConnectModule from 'connect';
import { METHODS } from '../const';
import http from 'http';
import chalk from 'chalk';


/**
* Generates a standard URL for a method.
*
* @param basePath:  The base path to prefix the URL with.
* @param path:      The main part of the URL.
*
* @return string.
*/
const methodUrl = (basePath, path) => {
  path = path.replace(/^\/*/, '');
  let url = `${ basePath }/${ path }`;
  url = '/' + url.replace(/^\/*/, '');
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
    *           - basePath: The base path to prepend URL's with.
    *           - version:  The version number of the service.
    */
  constructor(options = {}) {
    // Store state.
    this.name = options.name || 'Server Methods';
    this.version = options.version || '0.0.0';
    this[METHODS] = {};

    // Store base path.
    let path = options.basePath;
    if (_.isString(path)) {
      path = path.replace(/^\/*/, '').replace(/\/*$/, '');
    } else {
      path = '';
    }
    this.basePath = `/${ path }`;

    // Register middleware.
    let connect = options.connect;
    if (!connect) {
      connect = ConnectModule();
    }
    connect.use(bodyParser.json());
    connect.use(middleware(this));
    this.connect = connect;

    // Finish up.
    return this;
  }


  /**
  * Registers or retrieves the complete set of methods.
  *
  * @param definition: An object containing the method definitions.
  * @return an object containing the set of method definitions.
  */
  methods(definition) {
    // Write: store method definitions if passed.
    if (definition) {
      const createUrl = (path, methodDef) => {
          return methodUrl(this.basePath, (methodDef.url || path));
      };

      _.keys(definition).forEach((key) => {
          let methods = this[METHODS];
          if (methods[key]) { throw new Error(`Method '${ key }' already exists.`); }

          let value = definition[key];
          let url = createUrl(key, value);
          let methodSet;
          if (_.isFunction(value)) {
            // A single function was provided.
            // Use it for all the HTTP verbs.
            let func = value;
            let funcNoParams = function() { return func.call(this); };
            methodSet = {
              get: new Method(key, funcNoParams, url, 'GET'),
              put: new Method(key, func, url, 'PUT'),
              post: new Method(key, func, url, 'POST'),
              delete: new Method(key, funcNoParams, url, 'DELETE')
            }
          } else if(_.isObject(value)) {

            // Create individual methods for each verb.
            methodSet = {};
            if (value.get) { methodSet.get = new Method(key, value.get, url, 'GET'); }
            if (value.put) { methodSet.put = new Method(key, value.put, url, 'PUT'); }
            if (value.post) { methodSet.post = new Method(key, value.post, url, 'POST'); }
            if (value.delete) { methodSet.delete = new Method(key, value.delete, url, 'DELETE'); }

          } else {
            throw new Error(`Type of value for method '${ key }' not supported. Must be function or object.`);
          }

          // Store the values.
          this[METHODS][key] = methodSet;
      });
    }

    // Read.
    return this[METHODS];
  }


  /**
    * Starts the server.
    * Only use this if you're not passing in a connect server that
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
    const BASE_URL = `localhost:${ PORT }`;
    const HR = chalk.cyan(_.repeat('-', 80));
    console.log('');
    console.log(HR);
    const serviceName = `${ this.name } (v${ this.version })`;
    console.log(`${ chalk.grey('Running') } ${ chalk.black(serviceName) } ${ chalk.grey('on') } ${ chalk.cyan(BASE_URL) }`);
    console.log(HR);
    console.log('');

    // Finish up.
    return this;
  }
}



export default (options) => { return new Server(options); };
