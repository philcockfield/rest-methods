/* gloal window */
import client from './client';

/*
Export for webpack builds.
Make the proxy to the server is available globally.
*/
window.Server = client;
