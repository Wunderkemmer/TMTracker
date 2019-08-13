import constants from '../../lib/constants.js';
import { getTransactionData } from '../../lib/utils';

import { PROJECT_INFOS, RESOURCE_TYPES } from '../game/gameConstants';

const {
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTIONS,
  GAME_SET_GAME_STATE
} = constants;

export const runProject = (projectType) => {
  return (dispatch, getState) => {
    const projectInfo = PROJECT_INFOS[projectType];
    const { resourceCounts, resourceProductions } = getState().game;

    const {
      countChanges,
      productionChanges,
      canAfford,
      event,
      isCapped,
    } = getTransactionData(projectInfo, resourceCounts, resourceProductions);

    if (isCapped || !canAfford) {
      return false;
    }

    return dispatch(changeGameState(countChanges, productionChanges, event));
  };
};

export const changeCount = (type, amount, event) => (
  { type: GAME_CHANGE_COUNTS, payload: { countChanges: { [type]: amount }, event } }
);

export const changeCounts = (countChanges, event) => (
  { type: GAME_CHANGE_COUNTS, payload: { countChanges, event } }
);

export const changeGameState = (countChanges, productionChanges, event) => (
  { type: GAME_CHANGE_GAME_STATE, payload: { countChanges, productionChanges, event } }
);

export const changeProduction = (type, amount, event) => (
  { type: GAME_CHANGE_PRODUCTIONS, payload: { productionChanges: { [type]: amount }, event } }
);

export const changeProductions = (productionChanges, event) => (
  { type: GAME_CHANGE_PRODUCTIONS, payload: { productionChanges, event } }
);

export const nextGeneration = () => {
  return (dispatch, getState) => {
    const { resourceCounts: counts, resourceProductions: productions } = getState().game;

    const changes = {
      [RESOURCE_TYPES.MEGACREDITS]: productions.megacredits + counts.terraformingRating,
      [RESOURCE_TYPES.GENERATION]: 1
    };

    if (productions.steel) {
      changes[RESOURCE_TYPES.STEEL] = productions.steel;
    }

    if (productions.titanium) {
      changes[RESOURCE_TYPES.TITANIUM] = productions.titanium;
    }

    if (productions.plants) {
      changes[RESOURCE_TYPES.PLANTS] = productions.plants;
    }

    if (productions.energy - counts.energy) {
      changes[RESOURCE_TYPES.ENERGY] = productions.energy - counts.energy;
    }

    if (productions.heat + counts.energy) {
      changes[RESOURCE_TYPES.HEAT] = productions.heat + counts.energy;
    }

    return dispatch(changeCounts(changes, `Starting Generation ${ counts.generation + 1 }`));
  };
};

export const setGameState = (gameState) => (
  { type: GAME_SET_GAME_STATE, payload: { gameState } }
);

