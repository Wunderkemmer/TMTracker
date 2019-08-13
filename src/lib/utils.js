import { RESOURCE_INFOS } from '../store/game/gameConstants';

export function getTransactionData (transaction, resourceCounts, resourceProductions) {
  const { countChanges, productionChanges, event } = transaction;
  const countEntries = countChanges ? Object.entries(countChanges) : [];
  const productionEntries = productionChanges ? Object.entries(productionChanges) : [];

  const costInfos = [];
  const resultInfos = [];

  let canAffordCounts = true;
  let canAffordProductions = true;
  let isCapped = false;

  for (let [ key, value ] of countEntries) {
    const { image, maximumCount, minimumCount } = RESOURCE_INFOS[key];
    const newValue = value + resourceCounts[key];
    const info = { image, type: key, value };

    if (value < 0) {
      if (newValue < (minimumCount || 0)) {
        canAffordCounts = false;
      }

      costInfos.push(info);
    } else {
      if (maximumCount && newValue > maximumCount) {
        isCapped = true;
      }

      resultInfos.push(info);
    }
  }

  for (let [ key, value ] of productionEntries) {
    const image = RESOURCE_INFOS[key].image;
    const info = { image, isProduction: true, type: key, value };

    if (value < 0) {
      if (value + resourceProductions[key] < RESOURCE_INFOS[key].minimumProduction) {
        canAffordProductions = false;
      }

      costInfos.push(info);
    } else {
      resultInfos.push(info);
    }
  }

  const canAfford = canAffordCounts && canAffordProductions;

  return { canAfford, costInfos, event, isCapped, resultInfos };
}