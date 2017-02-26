import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import EditActionTypes from './EditActionTypes';
import Dispatcher from './EditDispatcher';

class EditStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case EditActionTypes.RR_QUERY:
        return state;
      default:
        return state;
    }
  }
}

export default new EditStore(Dispatcher);