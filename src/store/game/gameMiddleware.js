import constants from '../../lib/constants';

import { setGameState } from './gameActions';

const {
  UI_REDO,
  UI_SET_HISTORY,
  UI_START_GAME,
  UI_UNDO
} = constants;

export default function gameMiddleware (store) {
  return (next) => (action) => {
    switch (action.type) {
      case UI_REDO: {
        const { future } = store.getState().ui;

        store.dispatch(setGameState(future.get(0).gameState));

        break;
      }

      case UI_SET_HISTORY: {
        const { history } = action.payload;

        store.dispatch(setGameState(history[history.length - 1].gameState));

        break;
      }

      case UI_START_GAME: {
        const { gameState } = action.payload;

        store.dispatch(setGameState(gameState));

        break;
      }

      case UI_UNDO: {
        const { history } = store.getState().ui;

        store.dispatch(setGameState(history.get(history.size - 2).gameState));

        break;
      }
    }

    return next(action);
  };
}
