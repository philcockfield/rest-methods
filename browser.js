/**
 * The client for connecting to a browser to remote server's API.
 */
var client = require('./lib/client/Client').default;
var errors = require("./lib/errors");

client.ServerMethodError = errors.ServerMethodError;
module.exports = client;
