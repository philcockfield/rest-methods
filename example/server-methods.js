import Server from '../server';


var server = Server({
  name:'My Service',
  version: '1.0.1'
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

  'bar': () => {}

});
