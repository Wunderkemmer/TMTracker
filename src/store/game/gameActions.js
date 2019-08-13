import constants from '../../lib/constants.js';

import { PROJECT_INFOS, RESOURCE_INFOS, RESOURCE_TYPES, TERRAFORMING_INFOS } from '../game/gameConstants';

const {
  GAME_CHANGE_COUNTS,
  GAME_CHANGE_GAME_STATE,
  GAME_CHANGE_PRODUCTIONS,
  GAME_CHANGE_TERRAFORMINGS,
  GAME_SET_GAME_STATE
} = constants;

export const runProject = (projectType) => {
  return (dispatch, getState) => {
    const state = getState();
    const info = PROJECT_INFOS[projectType];
    const { resourceCounts, resourceProductions } = state.game;
    const { cap, cappedChanges, title } = info;

    let { countChanges, productionChanges, terraformingChanges } = info;

    // Check to see if the project is capped based on the game's state

    if (cap && TERRAFORMING_INFOS[cap].maximum && state.game[cap] >= TERRAFORMING_INFOS[cap].maximum) {
      return false;
    }

    // Check to see if we can afford this project's costs

    const countEntries = countChanges ? Object.entries(countChanges) : [];
    const productionEntries = productionChanges ? Object.entries(productionChanges) : [];

    for (let [ key, value ] of countEntries) {
      if (value < 0 && value + resourceCounts[key] < 0) {
        return false;
      }
    }

    for (let [ key, value ] of productionEntries) {
      if (value < 0 && value + resourceProductions[key] < RESOURCE_INFOS[key].minProduction) {
        return false;
      }
    }

    // Add any capped changes, but only if the cap isn't hit

    if (cappedChanges) {
      for (let [ key, value ] of Object.entries(cappedChanges)) {
        if (TERRAFORMING_INFOS[key].maximum && state.game[key] >= TERRAFORMING_INFOS[key].maximum) {
          continue;
        }

        const {
          countChanges: cappedCountChanges,
          productionChanges: cappedProductionChanges,
          terraformingChanges: cappedTerraformingChanges
        } = value;

        if (cappedCountChanges) {
          countChanges = { ...countChanges, ...cappedCountChanges };
        }

        if (cappedProductionChanges) {
          productionChanges = { ...productionChanges, ...cappedProductionChanges };
        }

        if (cappedTerraformingChanges) {
          terraformingChanges = { ...terraformingChanges, ...cappedTerraformingChanges };
        }
      }
    }

    return dispatch(changeGameState(
      countChanges,
      productionChanges,
      terraformingChanges,
      title
    ));
  };
};

export const changeCount = (type, amount, event) => (
  { type: GAME_CHANGE_COUNTS, payload: { countChanges: { [type]: amount }, event } }
);

export const changeCounts = (countChanges, event) => (
  { type: GAME_CHANGE_COUNTS, payload: { countChanges, event } }
);

export const changeGameState = (countChanges, productionChanges, terraformingChanges, event) => (
  {
    type: GAME_CHANGE_GAME_STATE,
    payload: { countChanges, productionChanges, terraformingChanges, event }
  }
);

export const changeProduction = (type, amount, event) => (
  { type: GAME_CHANGE_PRODUCTIONS, payload: { productionChanges: { [type]: amount }, event } }
);

export const changeProductions = (productionChanges, event) => (
  { type: GAME_CHANGE_PRODUCTIONS, payload: { productionChanges, event } }
);

export const changeTerraforming = (type, amount, event) => (
  { type: GAME_CHANGE_TERRAFORMINGS, payload: { terraformingChanges: { [type]: amount }, event } }
);

export const changeTerraformings = (terraformingChanges, event) => (
  { type: GAME_CHANGE_TERRAFORMINGS, payload: { terraformingChanges, event } }
);

export const nextGeneration = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { resourceCounts: counts, resourceProductions: productions } = state.game;

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

    return dispatch(changeCounts(changes, 'Next Generation'));
  };
};

export const setGameState = (gameState) => (
  { type: GAME_SET_GAME_STATE, payload: { gameState } }
);

