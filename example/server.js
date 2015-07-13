/*
  An example connect server that initializes the module.
  This is an example only.

  You'd typically use some helper library around connect,
  such as Express.js
*/

import fs from 'fs';
import connect from 'connect';
import http from 'http';
import Server from '../server';
const PORT = 3030;


// Server methods declared here:
import './server-methods';


// Initialize the web-server with the module's middleware.
let app = connect();
Server.init(app, { basePath: '/api/' });


// Sample HTML page.
app.use((req, res) => {
  fs.readFile(`${ __dirname }/index.html`, (err, result) => {
    res.end(result.toString());
  });
});


// Start the server.
http.createServer(app).listen(PORT);

// Output some helpful details to the console.
const BASE_URL = `localhost:${ PORT }`;
console.log('');
console.log(`Running on ${ BASE_URL }`);
console.log('');
