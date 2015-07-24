/**
 * The client for connecting to a remote server from the browser.
 */

require('babel/register');
module.exports = require('./src/client/Client').default;
