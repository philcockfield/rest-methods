import Server from '../server';


Server.methods({
  foo(text) {
    console.log('foo sample');
    return { hello:222 };
  }
});
