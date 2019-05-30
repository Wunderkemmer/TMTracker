import { combineReducers, createStore } from 'redux';

import economy from './economy/economyReducer';

const rootReducer = combineReducers({
  economy
});

export default createStore(rootReducer)