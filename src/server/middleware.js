import state from './state';



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
      let sendJson = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(obj));
      };


      if (req.url === path) {

          // TODO: Only on GET.

          let result = state.methods.map((item) => {
            return {};
          });
          sendJson(result);

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
