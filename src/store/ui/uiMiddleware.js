import AsyncStorage from '@react-native-community/async-storage';
import constants from '../../lib/constants';

import { addHistory } from './uiActions';

const {
  GAME_CHANGE_COUNT,
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTION,
  GAME_CHANGE_PRODUCTIONS,
  GAME_CHANGE_TERRAFORMING,
  GAME_CHANGE_TERRAFORMINGS,
  UI_ADD_HISTORY,
  UI_REDO,
  UI_START_GAME,
  UI_UNDO
} = constants;

let gameState = null;
let history = null;

const onChangeGameState = (store, transaction) => {
  const previousGameState = gameState;

  gameState = store.getState().game;

  if (previousGameState !== gameState) {
    store.dispatch(addHistory(gameState, transaction));
  }
};

const onChangeHistory = (store) => {
  const previousHistory = history;

  history = store.getState().ui.history;

  if (previousHistory !== history) {
    AsyncStorage.setItem('gameHistory', JSON.stringify(history.toJS()));
  }
};

export default function uiMiddleware (store) {

  return (next) => (action) => {
    switch (action.type) {
      case GAME_CHANGE_COUNT:
      case GAME_CHANGE_COUNTS:
      case GAME_CHANGE_GAME_STATE:
      case GAME_CHANGE_PRODUCTION:
      case GAME_CHANGE_PRODUCTIONS:
      case GAME_CHANGE_TERRAFORMING:
      case GAME_CHANGE_TERRAFORMINGS:
        // Wait until the next frame, the reducers
        // have finished updating the state by then

        setTimeout(() => onChangeGameState(store, action.payload), 0);

        break;

      case UI_ADD_HISTORY:
      case UI_REDO:
      case UI_START_GAME:
      case UI_UNDO:
        // Wait until the next frame, the reducers
        // have finished updating the state by then

        setTimeout(() => onChangeHistory(store), 0);

        break;
    }

    return next(action);
  };
}
