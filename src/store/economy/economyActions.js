import constants from '../../lib/constants.js'

const {
  ECONOMY_CHANGE_COUNTS,
  ECONOMY_CHANGE_PRODUCTION,
  ECONOMY_NEXT_GENERATION,
  ECONOMY_RESET_ECONOMY
} = constants;

export const changeCount = (type, amount) => (
  { type: ECONOMY_CHANGE_COUNT, payload: { type, amount } }
);

export const changeCounts = (changes) => (
  { type: ECONOMY_CHANGE_COUNTS, payload: { changes } }
);

export const changeProduction = (type, amount) => (
  { type: ECONOMY_CHANGE_PRODUCTION, payload: { type, amount } }
);

export const nextGeneration = () => (
  { type: ECONOMY_NEXT_GENERATION }
);

export const resetEconomy = () => (
  { type: ECONOMY_RESET_ECONOMY }
);

