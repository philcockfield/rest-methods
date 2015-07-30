import Server from '../server';

var server = Server({
  name:'My Service',
  version: '1.0.1',
  basePath: '/v1'
}).start({ port:3030 });



server.methods({
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

    get: (id, skip) => { return {id:id, date:new Date(), skip:skip }},
    put: (id, skip, count) => {}
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


// Invoke directly from the server.
// TEMP
server.methods.bar.get(123, 5)
.then((result) => {
  console.log('result - bar:', result);
})
