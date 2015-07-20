import fs from 'fs';
import fsPath from 'path';
import urlUtil from 'url';
import _ from 'lodash';
import util from 'js-util';
import Promise from 'bluebird';
import getManifest from './manifest';
import pageJS from '../page-js';
import docs from '../docs';
import { MANIFEST_PATH, METHODS } from '../const';
import stylus from 'stylus';
import nib from 'nib';


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
      const sendCss = (css) => { send(css, 'text/css'); };

      const sendStylus = (fileName) => {
          let file = getFile(fileName);
          stylus(file.text)
            .set('filename', file.path)
            .include(require('nib').path)
            .include(fsPath.join(__dirname, '../docs'))
            .render((err, css) => {
                if (err) { throw err; }
                sendCss(css);
            });
      };

      // Match the route.
      let basePath = server.basePath.replace(/\/$/, '');
      let url = urlUtil.parse(req.url, true);

      switch (url.pathname) {
        // GET: An HTML representation of the API (docs).
        case `${ basePath }/`:
            if (req.method === 'GET') {
              let manifest = getManifest(server, { docs:true });
              let html = getFile('../docs/page.html').text;
              html = html
                  .replace('{TITLE}', `${ server.name } (API)`)
                  .replace('{MANIFEST}', JSON.stringify(manifest))
                  .replace('{STYLE_PATH}', `${ basePath }/style.css`)
                  .replace('{SCRIPT_PATH}', `${ basePath }/docs.js`)
                  .replace('{CONTENT}', docs.toHtml(docs.Shell, { manifest:manifest }))

              sendHtml(html)
              break;
            }

        case `${ basePath }/style.css`:
            if (req.method === 'GET') {
              sendStylus('../docs/css/index.styl');
              break;
            }

        // GET: The manifest of methods.
        case MANIFEST_PATH:
            if (req.method === 'GET') {
              const withDocs = url.query.docs === 'true';
              sendJson(getManifest(server, { docs:withDocs }));
              break;
            }

        // GET: Serve the client JS.
        case `${ basePath }/browser.js`:
            if (req.method === 'GET') {
              sendJs('browser.js');
              break;
            }

        case `${ basePath }/browser.min.js`:
            if (req.method === 'GET') {
              sendJs('browser.min.js');
              break;
            }

        case `${ basePath }/docs.js`:
            if (req.method === 'GET') {
              sendJs('docs.js');
              break;
            }

        case `${ basePath }/docs.min.js`:
            if (req.method === 'GET') {
              sendJs('docs.min.js');
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
