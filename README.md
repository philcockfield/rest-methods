# server-methods
Promise-based, self-documenting isomorphic RESTful APIs.

[![Build Status](https://travis-ci.org/philcockfield/server-methods.svg)](https://travis-ci.org/philcockfield/server-methods)

Publish javascript functions as a REST/resource-oriented endpoint with a simple promise-based RPC style invocation on the client.



## TODO
- [ ] Generate HTML documentation page (/server-methods)
- [ ] Server => Server communications.
- [ ] Pass query string into method.
- [ ] Before/After hooks for logging, value manipulation.
- [ ] Start server directly.

Server examples
- [ ] Success
- [ ] throwing simple Error (500)
- [ ] using this.throw(status, message)
- [ ] Promise
  - [ ] success / error
- [ ] Differently crafted URL
- [ ] URL params (/:id => (id))





## Quick Start

    npm install --save server-methods

### Server
Initialize the `server-methods` middleware with a [connect](https://github.com/senchalabs/connect) based web-server, for instance [Express](http://expressjs.com/):


    import express from 'express';
    import Server from 'server-methods';

    const app = express();
    Server.init(app);


Declare your server methods:

    Server.methods({
      'sum': (first, second) => {
        return first + second;
      },

      'myAsync': () => {
        // Return a promise for async operations.
        return new Promise((resolve, reject) => {
          resolve({ text:'Some result' });
        });
      }
    });


### Client
On the client get a reference to the server proxy, and be sure to include this
file in your [WebPack](http://webpack.github.io/) build:

      import Server from 'server-methods/client'

Invoke the methods asynchronously with promises:

    Server.call('sum', 2, 1)
      .then(result => { // result: 3 })
      .catch(err => { ... });


## Example Server
To start the example server:

    npm run example

Then open your browser at `localhost:3030`.


## Test
    npm test
    npm run tdd  # Watch



## Development
To build the client javascript:

    npm run build



## Credit
Conceptually based on Meteor's server methods pattern.



## License (MIT)
Copyright © 2015, **Phil Cockfield**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
