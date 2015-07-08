import Immutable from 'immutable';


/**
* An internal API for holding state.
*/
export default {
  methods: Immutable.Map(),

  reset() {
    this.methods = this.methods.clear();
  }
};
