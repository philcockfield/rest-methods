import Server from '../server';


Server.methods({
  'foo'(text) {
    console.log(this.verb);
    console.log('method: "foo"');
    console.log('text', text);
    console.log('');
    return {
      method: 'foo',
      verb:this.verb,
      date: new Date(),
      text:text,
    };
  },


  'foo/bar'() {
    return {
      method: 'foo/bar',
      verb:this.verb,
      date: new Date(),
    };
  }
});
