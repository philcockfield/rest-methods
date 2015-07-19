import Server from '../server';


var server = Server({
  name:'My Service',
  version: '1.0.1',
  basePath: '/v1'
}).start();



server.methods({
  'foo': function(id, text) {
      console.log('invoking foo', id);
      // throw new Error('ouch')
      return {
        id: id,
        text: text,
        date: new Date()
      }
  },

  'bar': {
    url: '/user/:id',
    docs:
      `Foo
       Lorem \`ipsum\` dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

       - Foo
       - bar
       - Baz

       Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.


       @param {string} id: The ID Lorem ipsum dolor sit amet, consectetur \`adipisicing\` elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
       @return {object}
      `,

    get: (id) => {}
  },


  'baz': {
    put: () => {}
  }


});
