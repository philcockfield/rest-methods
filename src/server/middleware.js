import fs from 'fs';
import fsPath from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import state from './state';
import { BASE_URL } from '../const';

// let jsMinified;


const getMethods = () => {
  return state.methods.map((method) => {
    return {
      params: method.params
    };
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


      console.log('req.method', req.method); // TEMP


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
