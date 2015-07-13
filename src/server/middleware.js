import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import state from './state';
import { BASE_MODULE_PATH } from '../const';



const getMethods = () => {
  return state.methods.map((method) => {
      let result = {};
      ['get', 'put', 'post', 'delete'].map((verb) => {
          let item = method[verb];
          if (item) {
            let verbDefiniton = result[verb] = {}
            if (item.params.length > 0) { verbDefiniton.params = item.params; }
          }
      });
      return result;
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


const sendJson = (res, obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
};




/**
* The connect middleware for managing API calls to the server.
* @return the connect middleware function.
*/
export default () => {
  // Middleware.
  return (req, res, next) => {
      switch (req.url) {
        // GET: The manifest of methods.
        case `/${ BASE_MODULE_PATH }/manifest`:
            if (req.method === 'GET') {
              sendJson(res, { methods: getMethods() });
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

        // Invoke a method.
        case `/${ BASE_MODULE_PATH }/invoke`:
            let verb = req.method.toLowerCase()
            let data = req.body;
            let method = state.methods.get(data.method);

            if (!method || !method[verb]) {
              res.status(404).send(`A ${ req.method } method named '${ data.method }' does not exist on the server.`);
            } else {
              method[verb].invoke(req, data.args)
                .then((result) => { sendJson(res, result); })
                .catch((err) => { res.status(500).send(err.message); });
            }
            break;

        default:
            next();
      }
    };
};
