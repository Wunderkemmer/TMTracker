import { RESOURCE_INFOS } from '../store/game/gameConstants';

function processCountChanges (countChanges, resourceCounts, costs, results, skipSideEffects, isSideEffect) {
  const countEntries = countChanges ? Object.entries(countChanges) : [];

  let allCountChanges = {};
  let canAffordCounts = true;
  let isCapped = false;

  for (let [ type, value ] of countEntries) {
    const { image, maximumCount, minimumCount, sideEffects } = RESOURCE_INFOS[type];
    const newValue = value + resourceCounts[type];
    const ingredient = { image, type, value };

    if (value < 0) {
      allCountChanges[type] = value;

      if (newValue < (minimumCount || 0)) {
        canAffordCounts = false;
      }

      costs.push(ingredient);
    } else {
      if (maximumCount && newValue > maximumCount) {
        isCapped = true;
      }

      if (!isCapped || !isSideEffect) {
        allCountChanges[type] = value;

        results.push(ingredient);

        if (sideEffects && !skipSideEffects) {
          const data = processCountChanges(sideEffects, resourceCounts, costs, results, false, true);

          allCountChanges = { ...allCountChanges, ...data.allCountChanges };
        }
      }
    }
  }

  return { allCountChanges, canAffordCounts, isCapped };
}

function processProductionChanges (productionChanges, resourceProductions, costs, results) {
  const productionEntries = productionChanges ? Object.entries(productionChanges) : [];

  let canAffordProductions = true;

  for (let [ type, value ] of productionEntries) {
    const { image, minimumProduction } = RESOURCE_INFOS[type];
    const newValue = value + resourceProductions[type];
    const ingredient = { image, isProduction: true, type, value };

    if (value < 0) {
      if (newValue < (minimumProduction || 0)) {
        canAffordProductions = false;
      }

      costs.push(ingredient);
    } else {
      results.push(ingredient);
    }
  }

  return { allProductionChanges: productionChanges, canAffordProductions };
}

export function getTransactionData (transaction, resourceCounts, resourceProductions) {
  const { countChanges, event, skipSideEffects, productionChanges } = transaction;
  const costs = [];
  const results = [];

  const { allCountChanges, canAffordCounts, isCapped } = processCountChanges(
    countChanges, resourceCounts, costs, results, skipSideEffects
  );

  const { allProductionChanges, canAffordProductions } = processProductionChanges(
    productionChanges, resourceProductions, costs, results
  );

  const canAfford = canAffordCounts && canAffordProductions;

  return {
    countChanges: allCountChanges,
    productionChanges: allProductionChanges,
    canAfford,
    costs,
    event,
    isCapped,
    results
  };
}