/* gloal window */
import client from './src/client/client';
import { init } from './src/client/client';

// Only initialize if running in the browser.
if (window) {
  init().catch((err) => { throw err });
}

export default client;
