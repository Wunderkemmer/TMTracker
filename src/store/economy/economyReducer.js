import constants from '../../lib/constants';

import { RESOURCE_INFOS, RESOURCE_TYPES } from './economyConstants';
import EconomyState from './economyState';

const {
  ECONOMY_CHANGE_COUNT,
  ECONOMY_CHANGE_COUNTS,
  ECONOMY_CHANGE_PRODUCTION,
  ECONOMY_CHANGE_PRODUCTIONS,
  ECONOMY_NEXT_GENERATION,
  ECONOMY_RESET_ECONOMY
} = constants;

const max = Math.max;

const initialState = new EconomyState();

export default (state = initialState, action) => {
  switch (action.type) {
    case ECONOMY_CHANGE_COUNT: {
      const { amount, type } = action.payload;

      return state.setIn(
        [ 'resourceCounts', type ],
        max(state.resourceCounts[type] + amount, 0)
      );
    }

    case ECONOMY_CHANGE_COUNTS: {
      const { changes } = action.payload;

      changes.forEach((change) => {
        const { amount, type } = change;

        state.setIn(
          [ 'resourceCounts', type ],
          max(state.resourceCounts[type] + amount, 0)
        );
      });

      return state;
    }

    case ECONOMY_CHANGE_PRODUCTION: {
      const { amount, type } = action.payload;

      return state.setIn(
        [ 'resourceProductions', type ],
        max(state.resourceProductions[type] + amount, RESOURCE_INFOS[type].minProduction)
      );
    }

    case ECONOMY_CHANGE_PRODUCTIONS: {
      const { changes } = action.payload;

      changes.forEach((change) => {
        const { amount, type } = change;

        state.setIn(
          [ 'resourceProductions', type ],
          max(state.resourceProductions[type] + amount, RESOURCE_INFOS[type].minProduction)
        );
      });

      return state;
    }

    case ECONOMY_NEXT_GENERATION: {
      const { resourceCounts: counts, resourceProductions: productions } = state;

      return state
        .setIn(
          [ 'resourceCounts', RESOURCE_TYPES.GENERATION ],
          counts.generation + 1
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.MEGACREDITS ],
          counts.megacredits + productions.megacredits + counts.terraformingRating
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.STEEL ],
          counts.steel + productions.steel
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.TITANIUM ],
          counts.titanium + productions.titanium
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.PLANTS ],
          counts.plants + productions.plants
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.ENERGY ],
          productions.energy
        ).setIn(
          [ 'resourceCounts', RESOURCE_TYPES.HEAT ],
          counts.heat + productions.heat + counts.energy
        );
    }

    case ECONOMY_RESET_ECONOMY:
      return new EconomyState();
  }

  return state;
}
