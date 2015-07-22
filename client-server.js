require('babel/register');
var Client = require('./src/client/Client').default;
var http = require('http-promises/server');
var _ = require('lodash');


module.exports = function(options){
  options = options || {};
  options = _.clone(options);
  options.http = http; // Pass in the server HTTP helper.
  return Client(options);
};
