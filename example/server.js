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
import './methods';

let app = connect();

// Initialize the web-server with the module's middleware.
Server.init(app);


// Sample HTML page.
app.use((req, res) => {
  fs.readFile(`${ __dirname }/index.html`, (err, result) => {
    res.end(result.toString());
  });
});


// Start the server.
const PORT = 8080;
http.createServer(app).listen(PORT);

// Output some helpful details to the console.
const BASE_URL = `localhost:${ PORT }`;
console.log('');
console.log(`Running on ${ BASE_URL }`);
console.log('');
