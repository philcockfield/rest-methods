import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import manifest from './manifest';
import pageJS from '../page-js';
import web from '../web';
import { BASE_MODULE_PATH, METHODS } from '../const';
import stylus from 'stylus';



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
      const cache = {};

      const send = (content, contentType) => {
          res.setHeader('Content-Type', contentType);
          res.end(content);
      };


      const getFile = (fileName) => {
          let path = fsPath.join(__dirname, fileName);
          if (!cache[path]) {
            // NB: Only load from file if not in the cache.
            let text = fs.readFileSync(path).toString();
            cache[path] = { text:text, path:path };
          }
          return cache[path];
      };


      const sendJs = (fileName) => {
          let js = getFile(`../../dist/${ fileName }`).text;
          send(js, 'application/javascript');
      };

      const sendJson = (obj) => { send(JSON.stringify(obj), 'application/json'); };
      const sendHtml = (html) => { send(html, 'text/html') };

      const sendApiHtml = () => {
        let html = web.toHtml(web.Api, {
            pageTitle: `${ server.name } (v${ server.version })`,
            manifest: manifest(server)
        });
        sendHtml(html)
      };


      const sendStylus = (fileName) => {
          stylus.render(getFile(fileName).text, { filename: fileName }, function(err, css){
            if (err) { throw err; }
            send(css, 'text/css');
          });
      };


      switch (req.url) {
        // GET: An HTML representation of the API.
        case `/`:
            if (req.method === 'GET' && server.startedLocally) {
              sendApiHtml();
              break;
            }

        case `/${ BASE_MODULE_PATH }`:
            if (req.method === 'GET') {
              sendApiHtml();
              break;
            }

        case `/${ BASE_MODULE_PATH }.css`:
            if (req.method === 'GET') {
              sendStylus('../web/css.styl');
              break;
            }

        // GET: The manifest of methods.
        case `/${ BASE_MODULE_PATH }.json`:
            if (req.method === 'GET') {
              sendJson(manifest(server));
              break;
            }

        // GET: Serve the client JS.
        //      NB: Only required if not using WebPack.
        case `/${ BASE_MODULE_PATH }.client.js`:
            if (req.method === 'GET') {
              sendJs('client.js');
              break;
            }

        case `/${ BASE_MODULE_PATH }.client.min.js`:
            if (req.method === 'GET') {
              sendJs('client.min.js');
              break;
            }

        default:
            // Attempt to match the URL for a method.
            let methodVerb = matchMethodUrl(server, req.url, req.method);
            if (methodVerb) {
              // Invoke the method.
              methodVerb.invoke(req.body.args, req.url)
                .then((result) => { sendJson(result); })
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
