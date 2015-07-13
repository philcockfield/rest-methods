import Immutable from 'immutable';


/**
* An internal API for holding state.
*/
export default {
  methods: Immutable.Map(),
  basePath: '/',

  reset() {
    this.methods = this.methods.clear();
    this.basePath = '/';
  }
};
