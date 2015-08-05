var RestMethods = require('../client');
var server = RestMethods({ host:'localhost:3030' });


server.onReady(function(){

  console.log('');
  console.log('Ready');
  // console.log('server.methods', server.methods);
  console.log('');

  console.log('Invoking: server.methods.bar.get(123, 5)');
  console.log("");
  server.methods.bar.get(123, 5)
    .then(function(result) {
      console.log('Callback Result', result);
      console.log('');
    })
    .catch(function(err) {
      console.log("Callback Error:", err);
    });

});
