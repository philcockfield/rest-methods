/**
* An internal API for holding state.
*/
export default {
  methods: {},
  basePath: '/',
  version: null,

  reset() {
    this.methods = {};
    this.basePath = '/';
    this.version = null;
  }
};
