import Service from '../server';
import * as util from "js-util";

import express from "express";


var service = Service({
  name:'My Service',
  version: '1.0.1',
  basePath: '/v1'
  // docs: true
})//.start({ port:3030, silent:false });


const PORT = 3030;
const app = express()
    .use(service.middleware)
    .listen(PORT);
console.log("Listening on port:", PORT);


service.methods({
  'empty-1': {}, // Won't show.
  'empty-2': { docs:'foo' }, // Won't show.

  "args": {
    docs: `
      Lorem \`ipsum\` dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.
      - One
      - Two
      - Three

      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.

    `,
    get: function() { return { now: new Date() }; },
    put: function(id) { return { id:id }; }

  },


  'bar': {
    url: '/user/:id?skip=:skip',
    docs:
      `Foo
       Lorem \`ipsum\` dolor sit amet, consectetur adipisicing elit, sed do eiusmod
       tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

       - Foo
       - bar
       - Baz

       Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.


       @param {string} id: The ID Lorem ipsum dolor sit amet, consectetur \`adipisicing\` elit, sed do eiusmod tempor incididunt ut
                           labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
       @param {number} count: The thing that is a number.
       @return {object}
      `,

    get: function(id, skip) {
      return this.promise((resolve, reject) => {
        const URL = "https://api.fastchicken.co.nz/TripWallet/RateForCurrencyPair?baseCurrency=NZD&targetCurrency=GBP";
        this.http.get(URL)
        .then((result) => {
          resolve(result);
        })
      });



      // this.throw(403, "Thing");
      // return {id:id, date:new Date(), skip:skip }
    },
    put: (id, skip, data) => {

      console.log("PUT", data);
      return true

    }
  },


  'foo/bar': function(id, text) {
      // console.log('invoking foo', id);
      // throw new Error('ouch')

      console.log('id', id);
      console.log('text', text);
      console.log('');

      return {
        // id: id,
        text: text,
        date: new Date()
      }
  },

  'baz': {
    docs: `
      @param {object} value: The value to use.
      `,
    put: (value) => {
    }
  },
});


// service.before((e) => { console.log("BEFORE", e); });
// service.after((e) => { console.log("AFTER", e); });


// Invoke directly from the server.
// TEMP
// console.log("Example invoking on server...");
// console.log("");
// service.methods.bar.get(123, 5)
//   .then((result) => {
//     console.log("");
//     console.log('result - bar:', result);
//     console.log("");
//   })
//   .catch((err) => { console.log("err", err); })
