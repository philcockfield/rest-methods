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
const FAVICON = fs.readFileSync(fsPath.join(__dirname, "../docs/favicon.ico"));


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
    const context = new pageJS.Context(url);
    const methods = server[METHODS];
    const methodNames = Object.keys(methods);
    if (!_.isEmpty(methodNames)) {
      let methodName = _.find(Object.keys(methods), (key) => {
          let methodVerb = methods[key][verb];
          let isMatch = (methodVerb && methodVerb.pathRoute.match(context.path, context.params));
          return isMatch;
      });
      var method = methods[methodName];
    }
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
          const path = fsPath.join(__dirname, fileName);
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
          const pageProps = {
            title: `${ server.name } (API)`,
            manifest: manifest,
            faviconPath: `${ basePath }/favicon.ico`,
            stylePath: `${ basePath }/style.css`,
            scriptPath: `${ basePath }/docs.js`,
            bodyHtml: docs.toHtml(docs.Shell, { manifest: manifest })
          };
          sendHtml(docs.pageHtml(pageProps));
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
            sendStylus("../docs/css/index.styl");
            break;

        case `${ basePath }/favicon.ico`:
            send(FAVICON, "image/x-icon");
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
