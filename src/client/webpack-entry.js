/* gloal window */
import Server from './client';

/*
Export for webpack builds.
Make the [Server] object available globally.
*/
window.Server = Server;


// Only initialize if running in the browser.
if (window) {
  Server.init().catch((err) => { throw err });
}
