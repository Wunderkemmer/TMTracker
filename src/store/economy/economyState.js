import { Record } from 'immutable';

import { RESOURCE_TYPES } from './economyConstants';

const {
  TERRAFORMING_RATING,
  MEGACREDITS,
  STEEL,
  TITANIUM,
  PLANTS,
  ENERGY,
  HEAT,
  GENERATION
} = RESOURCE_TYPES;

export const ResourceCountsRecord = Record({
  [TERRAFORMING_RATING]: 20,
  [MEGACREDITS]: 20,
  [STEEL]: 0,
  [TITANIUM]: 0,
  [PLANTS]: 0,
  [ENERGY]: 0,
  [HEAT]: 0,
  [GENERATION]: 1
});

export const ResourceProductionsRecord = Record({
  [MEGACREDITS]: 1,
  [STEEL]: 1,
  [TITANIUM]: 1,
  [PLANTS]: 1,
  [ENERGY]: 1,
  [HEAT]: 1
});

export default Record({
  generation: 1,
  oceanCount: 0,
  oxygenLevel: 0,
  temperature: -30,

  resourceCounts: ResourceCountsRecord(),
  resourceProductions: ResourceProductionsRecord(),

  historyCount: 0,
  undoneHistoryCount: 0
});
