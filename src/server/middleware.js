import state from './state';


const getMethods = () => {
  return state.methods.map((method) => {
    return {
      params: method.params
    };
  });
};



/**
* The connect middleware for managing API calls to the server.
* @param path: The base path of the API url.
* @return the connect middleware function.
*/
export default (path) => {
  // Setup initial conditions.
  path = path.replace(/^\//, '').replace(/\/$/, '');
  path = `/${ path }/`;

  // Middleware.
  return (req, res, next) => {
      const sendJson = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(obj));
      };

      if (req.url === path) {

          // TODO: Only on GET.

          sendJson(getMethods());

      } else {
        next()
      }

      // switch (req.url) {
      //   case `${ path }/`:
      //     let result = {};
      //     state.methods.forEach((item) => {
      //       result[item.name] = {};
      //     });
      //     sendJson(result)
      //     break;
      //
      //   case `${ path }/invoke`:
      //     sendJson({foo:'thing'})
      //     break;
      //
      //   default:
      //     next();
      //
      // }
    };
};
