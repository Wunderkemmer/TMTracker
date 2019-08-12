import { Record } from 'immutable';

export const ResourceCountsRecord = Record({
  terraformingRating: 20,
  megacredits: 20,
  steel: 0,
  titanium: 0,
  plants: 0,
  energy: 0,
  heat: 0,
  generation: 1
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
  cityCount: 0,
  greeneryCount: 0,
  oceanCount: 0,
  oxygenLevel: 0,
  temperature: -30,

  resourceCounts: ResourceCountsRecord(),
  resourceProductions: ResourceProductionsRecord()
});
