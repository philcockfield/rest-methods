# server-methods
Declaratively publish functions for remote invocation.

[![Build Status](https://travis-ci.org/philcockfield/server-methods.svg)](https://travis-ci.org/philcockfield/server-methods)



## Quick Start

    npm install --save server-methods

### Server
Declare some methods on the server:

    import Server from 'server-methods';

    Server.methods({
      'foo': (number, increment) => {
        return number + increment;
      },

      'bar': () => {
        // Return a promise for async operations.
        return new Promise((resolve, reject) => {
          resolve({ text:'Some result' });
        });
      }
    });


### Client
On the client get a reference to the server proxy:

      import Server from 'server-methods/client'

Invoking the methods remotely returns promises:

    Server.call('foo', 5, 1)
      .then(result => {
          // result === 6
      })
      .catch(err => { ... });



## Test
    npm test
    npm run tdd  # Watch





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
