import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import manifest from './manifest';
import pageJS from '../page-js';
import html from '../html';
import { BASE_MODULE_PATH, METHODS } from '../const';





const jsCache = {};
const sendJs = (res, fileName) => {
  let js = jsCache[fileName];
  if (!js) {
    // NB: Loaded from file only once.
    js = fs.readFileSync(fsPath.join(__dirname, `../../dist/${ fileName }`)).toString();
    jsCache[fileName] = js;
  }
  res.setHeader('Content-Type', 'application/javascript');
  res.end(js);
};


const sendJson = (res, obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
};




/**
  * Determines whether the given URL path matches any of
  * the method routes.
  * @param server:  {Server} instance to examine.
  * @param url:     {string} The URL path to match.
  * @param verb:    {string} The HTTP verb to match (GET|PUT|POST|DELETE).
  * @return {ServerMethod}
  */
export const matchMethodUrl = (server, url, verb) => {
    verb = verb.toLowerCase();
    let context = new pageJS.Context(url);
    let methods = server[METHODS];
    let methodName = _.keys(methods).find((key) => {
        let methodVerb = methods[key][verb];
        let isMatch =  (methodVerb && methodVerb.route.match(context.path, context.params))
        return isMatch
    });
    let method = methods[methodName];
    return method ? method[verb] : undefined;
};



/**
* The connect middleware for managing API calls to the server.
* @param server:  {Server} instance the middleware is handling.
* @return the connect middleware function.
*/
export default (server) => {
  // Middleware.
  return (req, res, next) => {
      switch (req.url) {
        // GET: An HTML representation of the API.
        case `/${ BASE_MODULE_PATH }`:
            if (req.method === 'GET') {
              res.send(html.toHtml(html.Api, {
                pageTitle: server.name,
                manifest: manifest(server)
              }));
              break;
            }

        // GET: The manifest of methods.
        case `/${ BASE_MODULE_PATH }.json`:
            if (req.method === 'GET') {
              sendJson(res, manifest(server));
              break;
            }

        // GET: Serve the client JS.
        //      NB: Only required if not using WebPack.
        case `/${ BASE_MODULE_PATH }.client.js`:
            if (req.method === 'GET') {
              sendJs(res, 'client.js');
              break;
            }

        case `/${ BASE_MODULE_PATH }.client.min.js`:
            if (req.method === 'GET') {
              sendJs(res, 'client.min.js');
              break;
            }

        default:
            // Attempt to match the URL for a method.
            let methodVerb = matchMethodUrl(server, req.url, req.method);
            if (methodVerb) {
              // Invoke the method.
              methodVerb.invoke(req.body.args, req.url)
                .then((result) => { sendJson(res, result); })
                .catch((err) => {
                    res.statusCode = err.status || 500;
                    res.end(JSON.stringify(err));
                });

            } else {
              // No match - continue to [next] middleware method.
              next();
            }
      }
    };
};
