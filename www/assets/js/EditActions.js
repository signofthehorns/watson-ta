import EditActionTypes from './EditActionTypes';
import EditDispatcher from './EditDispatcher';

const Actions = {
  queryRetrieveAndRank(query) {
    EditDispatcher.dispatch({
      type: EditActionTypes.RR_QUERY,
      query,
    });
  },
};

export default Actions;