import Server from '../server';

var server = Server({
  name:'My Service',
  version: '1.0.1',
  basePath: '/v1'
}).start();



server.methods({
  'bar': {
    url: '/user/:id',
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
       @return {object}
      `,

    get: (id) => {}
  },


  'foo/bar': function(id, text) {
      // console.log('invoking foo', id);
      // throw new Error('ouch')
      return {
        // id: id,
        text: text,
        date: new Date()
      }
  },



  'baz': {
    put: () => {}
  },


});
