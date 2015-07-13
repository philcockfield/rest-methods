/* gloal window */
import client from './src/client/client';

// Only initialize if running in the browser.
if (window) {
  client.init().catch((err) => { throw err });
}

export default client;
