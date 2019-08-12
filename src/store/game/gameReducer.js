import constants from '../../lib/constants';

import { RESOURCE_INFOS, TERRAFORMING_INFOS } from './gameConstants';
import GameState from './gameState';

const {
  GAME_CHANGE_COUNT,
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTION,
  GAME_CHANGE_PRODUCTIONS,
  GAME_CHANGE_TERRAFORMING,
  GAME_CHANGE_TERRAFORMINGS
} = constants;

const max = Math.max;

const initialState = new GameState();

const updateResourceCount = (state, type, amount) => {
  if (amount !== undefined && state.resourceCounts[type] !== undefined) {
    state = state.setIn(
      [ 'resourceCounts', type ],
      max(state.resourceCounts[type] + amount, 0)
    );
  }

  return state;
};

const updateResourceCounts = (state, changes) => {
  if (changes) {
    for (let [ key, value ] of Object.entries(changes)) {
      state = updateResourceCount(state, key, value);
    }
  }

  return state;
};

const updateResourceProduction = (state, type, amount) => {
  if (amount !== undefined && state.resourceProductions[type] !== undefined) {
    state = state.setIn(
      [ 'resourceProductions', type ],
      max(state.resourceProductions[type] + amount, RESOURCE_INFOS[type].minProduction)
    );
  }

  return state;
};

const updateResourceProductions = (state, changes) => {
  if (changes) {
    for (let [ key, value ] of Object.entries(changes)) {
      state = updateResourceProduction(state, key, value);
    }
  }

  return state;
};

const updateTerraforming = (state, type, amount) => {
  if (amount !== undefined && state[type] !== undefined) {
    state = state.set(type, max(state[type] + amount, TERRAFORMING_INFOS[type].minimum));
  }

  return state;
};

const updateTerraformings = (state, changes) => {
  if (changes) {
    for (let [ key, value ] of Object.entries(changes)) {
      state = updateTerraforming(state, key, value);
    }
  }

  return state;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_CHANGE_COUNT: {
      const { amount, type } = action.payload;

      return updateResourceCount(state, type, amount);
    }

    case GAME_CHANGE_COUNTS: {
      const { changes } = action.payload;

      return updateResourceCounts(state, changes);
    }

    case GAME_CHANGE_GAME_STATE: {
      const { countChanges, productionChanges, terraformingChanges } = action.payload;

      state = updateResourceCounts(state, countChanges);
      state = updateResourceProductions(state, productionChanges);
      state = updateTerraformings(state, terraformingChanges);

      return state;
    }

    case GAME_CHANGE_PRODUCTION: {
      const { amount, type } = action.payload;

      return updateResourceProduction(state, type, amount);
    }

    case GAME_CHANGE_PRODUCTIONS: {
      const { changes } = action.payload;

      return updateResourceProductions(state, changes);
    }

    case GAME_CHANGE_TERRAFORMING: {
      const { amount, type } = action.payload;

      return updateTerraforming(state, type, amount);
    }

    case GAME_CHANGE_TERRAFORMINGS: {
      const { changes } = action.payload;

      return updateTerraformings(state, changes);
    }
  }

  return state;
}
