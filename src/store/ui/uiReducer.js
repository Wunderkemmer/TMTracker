import { List } from 'immutable';

import constants from '../../lib/constants';

import { MODAL_INFOS } from './uiConstants';
import UiState from './uiState';

const {
  UI_ADD_HISTORY,
  UI_HIDE_MODAL,
  UI_REDO,
  UI_SET_HISTORY,
  UI_SHOW_MODAL,
  UI_START_GAME,
  UI_UNDO
} = constants;

const initialState = new UiState();

export default (state = initialState, action) => {
  switch (action.type) {
    case UI_ADD_HISTORY: {
      const { gameState, transaction } = action.payload;

      return state
        .set('future', List())
        .set('history', List(state.history.concat({ gameState, transaction, time: Date.now() })));
    }

    case UI_HIDE_MODAL: {
      return state
        .set('modals', List(state.modals.filter((modal) => modal.id !== action.payload.id)));
    }

    case UI_REDO: {
      const history = state.history.push(state.future.get(0));
      const future = state.future.shift();

      return state
        .set('future', List(future))
        .set('history', List(history));
    }

    case UI_SET_HISTORY: {
      const { history } = action.payload;

      return state
        .set('future', List())
        .set('history', List(history));
    }

    case UI_SHOW_MODAL: {
      const { id, props } = action.payload;

      return state
        .set('modals', List(state.modals.concat({ id, ...MODAL_INFOS[id], ...props })));
    }

    case UI_START_GAME: {
      const { gameState, transaction } = action.payload;

      return state
        .set('future', List())
        .set('history', List([ { gameState, transaction, time: Date.now() } ]));
    }

    case UI_UNDO: {
      const future = state.future.unshift(state.history.get(state.history.size - 1));
      const history = state.history.pop();

      return state
        .set('future', List(future))
        .set('history', List(history));
    }
  }

  return state;
}
