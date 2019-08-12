import constants from '../../lib/constants';

import { MODAL_INFOS } from './uiConstants';
import UiState from './uiState';

const {
  UI_ADD_HISTORY,
  UI_HIDE_MODAL,
  UI_SET_HISTORY,
  UI_SHOW_MODAL,
  UI_START_GAME
} = constants;

const initialState = new UiState();

export default (state = initialState, action) => {
  switch (action.type) {
    case UI_ADD_HISTORY: {
      const { event, gameState, payload } = action.payload;

      return state
        .set('history', state.history.concat({ event, gameState, payload, time: Date.now() }));
    }

    case UI_HIDE_MODAL: {
      return state
        .set('modals', state.modals.filter((modal) => modal.id !== action.payload.id));
    }

    case UI_SET_HISTORY: {
      return state
        .set('history', action.payload.history);
    }

    case UI_SHOW_MODAL: {
      const { id, props } = action.payload;

      return state
        .set('modals', state.modals.concat({ id, ...MODAL_INFOS[id], ...props }));
    }

    case UI_START_GAME: {
      const { gameState } = action;

      return state
        .set('history', [ { event: 'newGame', gameState, time: Date.now() } ]);
    }
  }

  return state;
}
