import Server from '../server';


Server.methods({
  foo(text) {
    console.log(this.verb);
    console.log('method: "foo"');
    console.log('');
    return { hello:222 };
  }
});
