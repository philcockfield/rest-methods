import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import state from './state';
import { BASE_URL } from '../const';

let jsMinified;


const getMethods = () => {
  return state.methods.map((method) => {
    return {
      params: method.params
    };
  });
};


const invokeMethod = (method, args) => {
  return new Promise((resolve, reject) => {

    const rejectWithError = (err) => {
      reject(new Error(`Failed while executing '${ method.name }': ${ err.message }`));
    };

    try {
      let thisContext = {};
      let result = method.func.apply(thisContext, args);
      if (result && _.isFunction(result.then)) {
        // A promise was returned.
        result
          .then((asyncResult) => { resolve(asyncResult); })
          .catch((err) => { rejectWithError(err); });

      } else {
        // A simple value was returned.
        resolve(result);
      }

    } catch (err) { rejectWithError(err); }
  });
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
          res.send(JSON.stringify(obj));
      };


      console.log('req.method', req.method);


      switch (req.url) {
        // GET: The manifest of methods.
        case `/${ BASE_URL }/manifest`:
            if (req.method === 'GET') { sendJson({ methods: getMethods() }); }
            break;

        // GET: Server the client JS.
        //      NB: Only required if not using WebPack.
        // case `/${ BASE_URL }.js`:
        //     if (req.method === 'GET') {
        //       if (!jsMinified) {
        //         // NB: Only loaded from file once.
        //         jsMinified = fs.readFileSync(fsPath.join(__dirname, '../../dist/client.min.js')).toString();
        //       }
        //       res.setHeader('Content-Type', 'application/javascript');
        //       res.send(jsMinified);
        //     }
        //     break;

        // POST: Invoke a method.
        case `/${ BASE_URL }/invoke`:
            if (req.method === 'PUT') {
              let data = req.body;
              let method = state.methods.get(data.method);

              if (!method) {
                res.status(404).send(`Method named '${ data.method }' does not exist on the server.`);
              } else {
                invokeMethod(method, data.args)
                  .then((result) => { sendJson(result); })
                  .catch((err) => {
                    res.status(500).send(err.message);
                  });
              }
            }
            break;

        default:
            next();
      }
    };
};
