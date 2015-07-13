import Server from '../server';


Server.methods({
  foo(text) {
    console.log(this.verb);
    console.log('method: "foo"');
    console.log('text', text);
    console.log('');
    return { text:text, verb:this.verb };
  }
});
