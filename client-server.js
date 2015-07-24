/**
 * The client for connecting to a remote server on a server.
 */

// Note: Register [babel] only if another module hasn't already done so.
if (!global._babelPolyfill) { require('babel/register'); }

var Client = require('./src/client/Client').default;
var http = require('http-promises/server');
var _ = require('lodash');


module.exports = function(options){
  // Append the specified options with the server HTTP helper.
  options = _.clone(options || {});
  _.merge(options, {
    http: http
  });
  return Client(options);
};
