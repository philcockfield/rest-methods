import fs from "fs";
import fsPath from "path";
import urlUtil from "url";
import _ from "lodash";
import getManifest from "./manifest";
import pageJS from "../page-js";
import docs from "../docs";
import { MANIFEST_PATH, METHODS } from "../const";
import stylus from "stylus";
import nib from "nib";

const ROOT_PATH = fsPath.resolve(".");



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
    let methodName = _.find(Object.keys(methods), (key) => {
        let methodVerb = methods[key][verb];
        let isMatch = (methodVerb && methodVerb.route.match(context.path, context.params));
        return isMatch;
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
          res.setHeader("Content-Type", contentType);
          res.end(content);
      };

      const getFile = (fileName) => {
          let basePath = fileName.startsWith("/") ? ROOT_PATH : __dirname;
          let path = fsPath.join(basePath, fileName);
          if (!cache[path]) {
            // NB: Only load from file if not in the cache.
            let text = fs.readFileSync(path).toString();
            cache[path] = { text: text, path: path };
          }
          return cache[path];
      };

      const sendJs = (fileName) => {
          let js = getFile(`../../.build/${ fileName }`).text;
          send(js, "application/javascript");
      };

      const sendJson = (obj) => { send(JSON.stringify(obj), "application/json"); };
      const sendHtml = (html) => { send(html, "text/html"); };
      const sendCss = (css) => { send(css, "text/css"); };

      const sendStylus = (fileName) => {
          let file = getFile(fileName);
          stylus(file.text)
            .set("filename", file.path)
            .include(nib.path)
            .render((err, css) => {
                if (err) { throw err; }
                sendCss(css);
            });
      };

      const sendDocsHtml = () => {
          let manifest = getManifest(server, { docs: true });
          const page = {
            title: `${ server.name } (API)`,
            manifest: manifest,
            stylePath: `${ basePath }/style.css`,
            scriptPath: `${ basePath }/docs.js`,
            bodyHtml: docs.toHtml(docs.Shell, { manifest: manifest })
          };
          sendHtml(docs.pageHtml(page));
      };

      // Match the route.
      let basePath = server.basePath.replace(/\/$/, "");
      let url = urlUtil.parse(req.url, true);

      switch (url.pathname) {
        // GET: An HTML representation of the API (docs).
        case basePath:
            sendDocsHtml();
            break;

        case `${ basePath }/`:
            sendDocsHtml();
            break;

        case `${ basePath }/style.css`:
            sendStylus("/src/docs/css/index.styl");
            break;

        // GET: The manifest of methods.
        case MANIFEST_PATH:
            const withDocs = url.query.docs === "true";
            sendJson(getManifest(server, { docs: withDocs }));
            break;

        // GET: Serve the client JS.
        case `${ basePath }/browser.js`:
            sendJs("browser.js");
            break;

        case `${ basePath }/docs.js`:
            sendJs("docs.js");
            break;


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
