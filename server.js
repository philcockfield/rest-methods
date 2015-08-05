/**
 * The API server.
 */
var server = require('./lib/server/server');
var errors = require("./lib/errors");

server.ServerMethodError = errors.ServerMethodError;
module.exports = server;
