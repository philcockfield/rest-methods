var ClientServer = require('../client-server');
var server = ClientServer({ host:'localhost:3030' });

server.onReady(function(){

  console.log('');
  console.log('Ready');
  console.log('server.methods', server.methods);
  console.log('');

  console.log('Invoking: server.methods.bar.get(123, 5)');
  server.methods.bar.get(123, 5)
  .then(function(result) {
    console.log('result', result);
    console.log('');
  });

});
