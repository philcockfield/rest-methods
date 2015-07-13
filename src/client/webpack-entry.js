/* gloal window */
import Server from './client';

/*
Export for webpack builds.
Make the [Server] object available globally.
*/
window.Server = Server;
