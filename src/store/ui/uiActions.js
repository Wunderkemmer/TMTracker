import constants from '../../lib/constants.js'

const {
  UI_ADD_HISTORY,
  UI_HIDE_MODAL,
  UI_REDO,
  UI_SET_HISTORY,
  UI_SHOW_MODAL,
  UI_START_GAME,
  UI_UNDO
} = constants;

export const addHistory = (gameState, transaction) => (
  { type: UI_ADD_HISTORY, payload: { gameState, transaction } }
);

export const hideModal = (id) => (
  { type: UI_HIDE_MODAL, payload: { id } }
);

export const redo = () => (
  { type: UI_REDO }
);

export const setHistory = (history) => (
  { type: UI_SET_HISTORY, payload: { history } }
);

export const showModal = (id, props) => (
  { type: UI_SHOW_MODAL, payload: { id, props } }
);

export const startGame = (gameState) => (
  { type: UI_START_GAME, payload: { gameState, transaction: { event: 'New Game' } } }
);

export const undo = () => (
  { type: UI_UNDO }
);

