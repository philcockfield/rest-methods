import state from './state';
import { BASE_URL } from '../const';


const getMethods = () => {
  return state.methods.map((method) => {
    return {
      params: method.params
    }
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

      switch (req.url) {
        case `/${ BASE_URL }/manifest`:
          if (req.method === 'GET') {
            sendJson({ methods: getMethods() });
          }
          break;

        case `/${ BASE_URL }/invoke`:

          if (req.method === 'POST') {
            let data = req.body;
            let method = state.methods.get(data.name);

            console.log('data', data);
            console.log('method', method);
            method.func(); // TEMP

            sendJson({ temp:444 });

          }


          break;

        default:
          next();
      }
    };
};
