import EditQuizView from './EditQuizView';
import {Container} from 'flux/utils';
import EditStore from './EditStore';

function getStores() {
  return [
    EditStore,
  ];
}

function getState() {
  return {
    quiz_state: EditStore.getState(),
  };
}

export default Container.createFunctional(EditQuizView, getStores, getState);