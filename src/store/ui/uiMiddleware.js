import constants from '../../lib/constants';

import { addHistory } from './uiActions';

const {
  GAME_CHANGE_COUNT,
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTION,
  GAME_CHANGE_PRODUCTIONS,
  GAME_CHANGE_TERRAFORMING,
  GAME_CHANGE_TERRAFORMINGS
} = constants;

let gameState = null;

const onChange = (store, event) => {
  const previousGameState = gameState;

  gameState = store.getState().game;

  if (previousGameState !== gameState) {
    store.dispatch(addHistory(event, gameState));
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
        setTimeout(() => onChange(store, action.payload.event), 0);
    }

    return next(action);
  };
}
