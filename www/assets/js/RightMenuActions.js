import RightMenuActionTypes from './RightMenuActionTypes';
import RightMenuDispatcher from './RightMenuDispatcher';

const Actions = {
  permuteMenuItems(startIndex, targetIndex) {
    RightMenuDispatcher.dispatch({
      type: RightMenuActionTypes.PERMUTE,
      startIndex,
      targetIndex,
    });
  },
};

export default Actions;