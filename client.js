/**
 * The client for connecting a server to a remote server's API.
 */
var client = require('./lib/client/Client').default;
var http = require('http-promises/server');
var _ = require('lodash');


module.exports = function(options){
  // Append the specified options with the server HTTP helper.
  options = _.clone(options || {});
  _.merge(options, {
    http: http
  });
  return client(options);
};
