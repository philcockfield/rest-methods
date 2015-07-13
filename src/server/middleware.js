import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import state from './state';
import { BASE_PATH } from '../const';



const getMethods = () => {
  return state.methods.map((method) => {
    return {
      params: method.params
    };
  });
};


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




/**
* The connect middleware for managing API calls to the server.
* @return the connect middleware function.
*/
export default () => {

  // Middleware.
  return (req, res, next) => {
      const sendJson = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
      };

      switch (req.url) {
        // GET: The manifest of methods.
        case `/${ BASE_PATH }/manifest`:
            if (req.method === 'GET') {
              sendJson({ methods: getMethods() });
              break;
            }

        // GET: Serve the client JS.
        //      NB: Only required if not using WebPack.
        case `/${ BASE_PATH }.client.js`:
            if (req.method === 'GET') {
              sendJs(res, 'client.js');
              break;
            }

        case `/${ BASE_PATH }.client.min.js`:
            if (req.method === 'GET') {
              sendJs(res, 'client.min.js');
              break;
            }

        // POST: Invoke a method.
        case `/${ BASE_PATH }/invoke`:
            if (req.method === 'PUT') {
              let data = req.body;
              let method = state.methods.get(data.method);

              if (!method) {
                res.status(404).send(`Method named '${ data.method }' does not exist on the server.`);
              } else {
                method.invoke(req, data.args)
                .then((result) => { sendJson(result); })
                .catch((err) => { res.status(500).send(err.message); });
              }
            }
            break;

        default:
            next();
      }
    };
};
