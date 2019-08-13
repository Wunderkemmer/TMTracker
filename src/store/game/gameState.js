import { Record } from 'immutable';

export const ResourceCountsRecord = Record({
  terraformingRating: 20,

  megacredits: 20,
  steel: 0,
  titanium: 0,
  plants: 0,
  energy: 0,
  heat: 0,

  generation: 1,

  cities: 0,
  greenery: 0,
  oceans: 0,
  oxygen: 0,
  temperature: -30,
});

export const ResourceProductionsRecord = Record({
  megacredits: 1,
  steel: 1,
  titanium: 1,
  plants: 1,
  energy: 1,
  heat: 1
});

export default Record({
  resourceCounts: ResourceCountsRecord(),
  resourceProductions: ResourceProductionsRecord()
});
