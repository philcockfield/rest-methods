# Rest Methods
[![Build Status](https://travis-ci.org/philcockfield/rest-methods.svg)](https://travis-ci.org/philcockfield/rest-methods)

Isomorphic, promise-based REST API's.

Publish javascript functions as a REST/resource-oriented endpoint with a simple promise-based RPC style invocation on the client.




## Install

    npm install --save rest-methods


## Getting Started
#### Create The Server (Quick Start)
Create and start a new REST web-service with the internal connect server on the default port:
```js
var Service require("rest-methods/server");;
var service = Service({ name:'My Service' }).start();

```


#### Create Server (With Express and Options)
You may be wanting to expose a REST API as part of wider web-app.  Simply pass in your connect-based server as an option at setup.

```js
var express = require("express");
var Service = require("rest-methods/server");;

var app = express();
var service = Service({
  name:'My Service',
  version: '1.0.1',
  basePath: '/v1',
  connect: app
}).start({ port:3030 });
```

The example above shows additional configuration options, including a service `version` and a base URL path that all REST urls are prefixed with.


#### Craft Your API
Your service API is exposed by declaring methods. This is the simplest kind of method declaration:

```js
service.methods({
  "user": function() {
    console.log(this);
    return { date:new Date() };
  }
});
```

Navigate to the services documentation in your browser ([`http://localhost:3030/v1`](http://localhost:3030/v1)) and you will see your method documented as:

![Foo Method](https://cloud.githubusercontent.com/assets/185555/9016885/92f68662-3828-11e5-99f8-5308d6283524.png)

By declaring a single function, each of the HTTP verbs (`GET`, `POST`, `PUT}`, `DELETE`) is represented.  Click on the URL (`/v1/user`) and you will see the `GET` be executed, with the console logging the `this` context that contains details about which verb was invoked and details about the URL.


## Modeling the REST API
We can craft the shape of the REST API in the following ways:

- Expose different handlers for each HTTP verb.
- Expose only a subset of HTTP verbs.
- Take parameters.
- Shape the URL with parameters.

For example, here we are crafting a `user` method that takes the ID of the user in the URL and passes it do the `GET/POST/PUT` methods.  We are choosing notto make a `DELETE` method available:

```js
service.methods({
  "user": {
    url: "/users/:id",
    get: function(id) { return { verb:'GET', date:new Date() }; },
    post: function(id, data) { return { verb:'POST', date:new Date(), id:id }; },
    put: function(id, data) { return { verb:'PUT', date:new Date(), id:id }; },
  }
});
```

The URL to this method would look something like:

    /v1/users/123

Where the `id` is `123` which is passed to the correspondingly named parameters of each of the method handlers.

#### URL Parameters
Parameters that are baked into the URL are mapped to correspondingly named function parameters.  URL parameters must come before other parameters in the function definition.  

The service will help you out by throwing useful error messages if you declare something that it is not expecting.

URL parameters can also be placed within the query string, for example:

```js
{
  url: "/books/:year?skip=:skip&take=:take",
  get: function(year, skip, take) { ... }
}
```

#### Documentation
Providing JSDocs style comments enhances the published documentation for consumers of your service.  The `docs` field can contain markdown along with `@param {type}` details for each parameter:

```js
service.methods({
  "user": {
    docs: `
    Retrieves and manages the specified user, including:
    - Profile
    - Friends
    - Access history

    @param {string} id: The unique identifier of the user.
    @param {object} data: The user data to update.
    `,
    url: "/users/:id",
    get: function(id) { return { verb:'GET', date:new Date() }; },
    post: function(id, data) { return { verb:'POST', date:new Date(), id:id }; },
    put: function(id, data) { return { verb:'PUT', date:new Date(), id:id }; },
  }
});

```
![Docs](https://cloud.githubusercontent.com/assets/185555/9017617/d41b2bae-382b-11e5-8f7b-95e24e604920.png)


## Invoking Methods (Isomorphic/Promises)
The module provides a consistent isomorphic experience for consuming your REST service, making it fast and convient to invoke REST methods without needing to maintain URL manipulation code.

The service can be consumed using a dynamically created promise-based client library from:

- The browser
- A remote server
- The REST server itself.

### From the Browser



----

# TODO


- params
- deep namespace (foo/bar)
- crafting URLs (query strings)
- throwing errors
- calling from another server.
- calling from the browser



--------

## Test
    npm test
    npm run tdd  # Watch



## Development

    gulp build
    nodemon ./example -e js,jsx,styl



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
