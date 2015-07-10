/* gloal window */
import proxy from './src/client/proxy';
import { init } from './src/client/proxy';

if (window) { init(); } // Only initialize if running in the browser.

export default proxy;
