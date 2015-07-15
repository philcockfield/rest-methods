import Server from '../server';


Server.methods({
  'foo': (id, text) => {
      console.log('invoking foo', id);
      // throw new Error('ouch')
      return {
        id: id,
        text: text,
        date: new Date()
      }

  },

  // 'foo1': {
  //   // url: '/my-url/:id',
  //   get: (id, text) => {
  //     console.log('invoking foo', id);
  //     return {
  //       id: id,
  //       text: text,
  //       date: new Date()
  //     }
  //   },
  //   put: (id, text) => {
  //     console.log('invoking foo', id);
  //     return {
  //       id: id,
  //       text: text,
  //       date: new Date()
  //     }
  //   }
  // },

  'foo/bar': {
    put: (text) => {
      throw new Error('Yo not gonna do it');
      return {
        success:true,
        text:text,
        date:new Date()
        // verb: this.verb
      };
    }
  }

});
