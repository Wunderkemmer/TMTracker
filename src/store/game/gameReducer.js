import constants from '../../lib/constants';

import { RESOURCE_INFOS } from './gameConstants';
import GameState from './gameState';

const {
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTIONS,
  GAME_SET_GAME_STATE
} = constants;

const max = Math.max;

const initialState = new GameState();

const updateResourceCount = (state, type, amount) => {
  if (amount !== undefined && state.resourceCounts[type] !== undefined) {
    state = state.setIn(
      [ 'resourceCounts', type ],
      max(state.resourceCounts[type] + amount, RESOURCE_INFOS[type].minimumCount || 0)
    );
  }

  return state;
};

const updateResourceCounts = (state, countChanges) => {
  if (countChanges) {
    for (let [ key, value ] of Object.entries(countChanges)) {
      state = updateResourceCount(state, key, value);
    }
  }

  return state;
};

const updateResourceProduction = (state, type, amount) => {
  if (amount !== undefined && state.resourceProductions[type] !== undefined) {
    state = state.setIn(
      [ 'resourceProductions', type ],
      max(state.resourceProductions[type] + amount, RESOURCE_INFOS[type].minimumProduction || 0)
    );
  }

  return state;
};

const updateResourceProductions = (state, productionChanges) => {
  if (productionChanges) {
    for (let [ key, value ] of Object.entries(productionChanges)) {
      state = updateResourceProduction(state, key, value);
    }
  }

  return state;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_CHANGE_COUNTS: {
      const { countChanges } = action.payload;

      return updateResourceCounts(state, countChanges);
    }

    case GAME_CHANGE_GAME_STATE: {
      const { countChanges, productionChanges } = action.payload;

      state = updateResourceCounts(state, countChanges);
      state = updateResourceProductions(state, productionChanges);

      return state;
    }

    case GAME_CHANGE_PRODUCTIONS: {
      const { productionChanges } = action.payload;

      return updateResourceProductions(state, productionChanges);
    }

    case GAME_SET_GAME_STATE: {
      const { gameState } = action.payload;

      return GameState(gameState);
    }
  }

  return state;
}
