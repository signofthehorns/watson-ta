import SideMenuActionTypes from './SideMenuActionTypes';
import SideMenuDispatcher from './SideMenuDispatcher';

const Actions = {
  permuteMenuItems(startIndex, targetIndex) {
    SideMenuDispatcher.dispatch({
      type: SideMenuActionTypes.PERMUTE,
      startIndex,
      targetIndex,
    });
  },
};

export default Actions;