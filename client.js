/* gloal window */
import proxy from './src/client/proxy';
import { init } from './src/client/proxy';

// Only initialize if running in the browser.
if (window) {
  init().catch((err) => { throw err });
}

export default proxy;
