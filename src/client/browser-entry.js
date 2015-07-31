import client from "./Client";


/*
Export for webpack builds.
Make the proxy to the server is available globally.

Note: The client is named `Server` to represent it as a proxy
      to the server on the client.
*/
window.RestService = client();
