import { applyMiddleware, combineReducers, createStore } from 'redux';

import thunk from 'redux-thunk';

import game from './game/gameReducer';
import gameMiddleware from './game/gameMiddleware';
import ui from './ui/uiReducer';
import uiMiddleware from './ui/uiMiddleware';

const rootReducer = combineReducers({
  game,
  ui
});

const middleWares = [
  thunk,
  gameMiddleware,
  uiMiddleware
];

export default createStore(rootReducer, applyMiddleware(...middleWares))
