import fs from "fs";
import fsPath from "path";
import urlUtil from "url";
import bodyParser from "body-parser";
import getManifest from "./manifest";
import docs from "../docs";
import { MANIFEST_PATH, INVOKE } from "../const";
import stylus from "stylus";
import nib from "nib";

const jsonParser = bodyParser.json();
const FAVICON = fs.readFileSync(fsPath.join(__dirname, "../docs/favicon.ico"));


// Middleware.
const middleware = (server, req, res, next) => {
  let basePath = server.basePath.replace(/\/$/, "");
  let url = urlUtil.parse(req.url, true);

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

  const send404 = (message) => {
    res.statusCode = 404;
    send(message || "Not found", "text/plain");
  };

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
      if (server.docs === true) {
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

      } else {
        send404();
      }
  };

  // Match the route.
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
        if (server.docs === true) {
          sendJs("docs.js");
        } else {
          send404();
        }
        break;


    default:
        // Attempt to match the URL for a method.
        const methodVerb = server.match(req.url, req.method);
        if (methodVerb) {
          // Invoke the method.
          let args = req.body.args || req.body;
          args = _.isArray(args) ? args : [args];
          
          server[INVOKE](methodVerb, args, req.url)
            .then((result) => { sendJson(result); })
            .catch((err) => {
                res.statusCode = err.status || 500;
                sendJson(err);
            });

        } else {
          // No match - continue to [next] middleware method.
          next();
        }
  }
};




/**
* The connect middleware for managing API calls to the server.
* @param server:  {Server} instance the middleware is handling.
* @return the connect middleware function.
*/
export default (server) => {
  return function(req, res, next) {
    // Return the middleware passed through the JSON parser.
    jsonParser(req, res, () => { middleware(server, req, res, next); });
  };
};
