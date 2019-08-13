import ImageIconCard from '../../../resources/images/icon_card.png';
import ImageIconCity from '../../../resources/images/icon_city.png';
import ImageIconEnergy from '../../../resources/images/icon_energy.png';
import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconHeat from '../../../resources/images/icon_heat.png';
import ImageIconMegacredits from '../../../resources/images/icon_mega_credits.png';
import ImageIconOcean from '../../../resources/images/icon_ocean.png';
import ImageIconOxygen from '../../../resources/images/icon_oxygen.png';
import ImageIconPlants from '../../../resources/images/icon_plants.png';
import ImageIconSteel from '../../../resources/images/icon_steel.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';
import ImageIconTerraformingRating from '../../../resources/images/icon_terraforming_rating.png';
import ImageIconTitanium from '../../../resources/images/icon_titanium.png';

export const PROJECT_TYPES = {
  ADD_OCEAN: 'addOcean',
  ADD_OXYGEN: 'addOxygen',
  ADD_TEMPERATURE: 'addTemperature',
  BUY_ASTEROID: 'buyAsteroid',
  BUY_AQUIFER: 'buyAquifer',
  BUY_CITY: 'buyCity',
  BUY_GREENERY: 'buyGreenery',
  BUY_POWER_PLANT: 'buyPowerPlant',
  SELL_PATENT: 'sellPatent',
  TRADE_HEAT: 'tradeHeat',
  TRADE_PLANTS: 'tradePlants'
};

export const RESOURCE_TYPES = {
  TERRAFORMING_RATING: 'terraformingRating',
  MEGACREDITS: 'megacredits',
  STEEL: 'steel',
  TITANIUM: 'titanium',
  PLANTS: 'plants',
  ENERGY: 'energy',
  HEAT: 'heat',
  GENERATION: 'generation'
};

export const TERRAFORMING_TYPES = {
  CARD: 'card',
  CITY_COUNT: 'cityCount',
  GREENERY_COUNT: 'greeneryCount',
  OCEAN_COUNT: 'oceanCount',
  OXYGEN_LEVEL: 'oxygenLevel',
  TEMPERATURE: 'temperature'
};

export const PROJECT_INFOS = {

  [PROJECT_TYPES.ADD_OCEAN]: {
    cap: TERRAFORMING_TYPES.OCEAN_COUNT,
    countChanges: {
      [TERRAFORMING_TYPES.OCEAN_COUNT]: 1
    },
    title: 'Add Ocean'
  },

  [PROJECT_TYPES.ADD_OXYGEN]: {
    cap: TERRAFORMING_TYPES.OXYGEN_LEVEL,
    terraformingChanges: {
      [TERRAFORMING_TYPES.OXYGEN_LEVEL]: 1
    },
    title: 'Add Oxygen'
  },

  [PROJECT_TYPES.ADD_TEMPERATURE]: {
    cap: TERRAFORMING_TYPES.TEMPERATURE,
    terraformingChanges: {
      [TERRAFORMING_TYPES.TEMPERATURE]: 2
    },
    title: 'Add Temperature'
  },

  [PROJECT_TYPES.BUY_ASTEROID]: {
    cap: TERRAFORMING_TYPES.TEMPERATURE,
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -14,
      [RESOURCE_TYPES.TERRAFORMING_RATING]: 1
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.TEMPERATURE]: 2
    },
    title: 'Buy Asteroid'
  },

  [PROJECT_TYPES.BUY_AQUIFER]: {
    cap: TERRAFORMING_TYPES.OCEAN_COUNT,
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -18,
      [RESOURCE_TYPES.TERRAFORMING_RATING]: 1
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.OCEAN_COUNT]: 1
    },
    title: 'Buy Aquifer'
  },

  [PROJECT_TYPES.BUY_CITY]: {
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -25
    },
    productionChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: 1
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.CITY_COUNT]: 1
    },
    title: 'Buy City'
  },

  [PROJECT_TYPES.BUY_GREENERY]: {
    cappedChanges: {
      [TERRAFORMING_TYPES.OXYGEN_LEVEL]: {
        countChanges: {
          [RESOURCE_TYPES.TERRAFORMING_RATING]: 1
        },
        terraformingChanges: {
          [TERRAFORMING_TYPES.OXYGEN_LEVEL]: 1
        }
      }
    },
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -23
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.GREENERY_COUNT]: 1
    },
    title: 'Buy Greenery'
  },

  [PROJECT_TYPES.BUY_POWER_PLANT]: {
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -11
    },
    productionChanges: {
      [RESOURCE_TYPES.ENERGY]: 1
    },
    title: 'Buy Power Plant'
  },

  [PROJECT_TYPES.SELL_PATENT]: {
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: 1
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.CARD]: -1
    },
    title: 'Sell Patent'
  },

  [PROJECT_TYPES.TRADE_HEAT]: {
    cap: TERRAFORMING_TYPES.TEMPERATURE,
    countChanges: {
      [RESOURCE_TYPES.HEAT]: -8,
      [RESOURCE_TYPES.TERRAFORMING_RATING]: 1
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.TEMPERATURE]: 2
    },
    title: 'Trade Heat'
  },

  [PROJECT_TYPES.TRADE_PLANTS]: {
    cappedChanges: {
      [TERRAFORMING_TYPES.OXYGEN_LEVEL]: {
        countChanges: {
          [RESOURCE_TYPES.TERRAFORMING_RATING]: 1
        },
        terraformingChanges: {
          [TERRAFORMING_TYPES.OXYGEN_LEVEL]: 1
        }
      }
    },
    countChanges: {
      [RESOURCE_TYPES.PLANTS]: -8
    },
    terraformingChanges: {
      [TERRAFORMING_TYPES.GREENERY_COUNT]: 1
    },
    title: 'Trade Plants'
  }

};

export const RESOURCE_INFOS = {

  [RESOURCE_TYPES.TERRAFORMING_RATING]: {
    color: '#ED721F',
    hideIngredient: true,
    hideTitleInTracker: true,
    image: ImageIconTerraformingRating,
    minProduction: 0,
    title: 'Terraforming Rating',
    usePositiveCalculator: true,
    useSmallTracker: true
  },

  [RESOURCE_TYPES.MEGACREDITS]: {
    color: '#FFCC33',
    image: ImageIconMegacredits,
    minProduction: -5,
    title: 'MegaCredits'
  },

  [RESOURCE_TYPES.STEEL]: {
    color: '#B37D43',
    image: ImageIconSteel,
    minProduction: 0,
    multiplier: 2,
    title: 'Steel'
  },

  [RESOURCE_TYPES.TITANIUM]: {
    color: '#777777',
    image: ImageIconTitanium,
    minProduction: 0,
    multiplier: 3,
    title: 'Titanium'
  },

  [RESOURCE_TYPES.PLANTS]: {
    color: '#5FB365',
    image: ImageIconPlants,
    minProduction: 0,
    title: 'Plants'
  },

  [RESOURCE_TYPES.ENERGY]: {
    color: '#A34Cb8',
    image: ImageIconEnergy,
    minProduction: 0,
    title: 'Energy'
  },

  [RESOURCE_TYPES.HEAT]: {
    color: '#ED4E44',
    image: ImageIconHeat,
    minProduction: 0,
    multiplier: 1,
    title: 'Heat'
  },

  [RESOURCE_TYPES.GENERATION]: {
    button1Icon: 'bars',
    color: '#5B8BDD',
    hideIngredient: true,
    minProduction: 0,
    title: 'Generation',
    useDebounce: true,
    useSmallTracker: true
  }

};

export const TERRAFORMING_INFOS = {

  [TERRAFORMING_TYPES.CARD]: {
    color: '#222222',
    image: ImageIconCard,
    title: 'Card'
  },

  [TERRAFORMING_TYPES.CITY_COUNT]: {
    color: '#777777',
    image: ImageIconCity,
    title: 'City Count'
  },

  [TERRAFORMING_TYPES.GREENERY_COUNT]: {
    color: '#5FB365',
    image: ImageIconGreenery,
    sideEffect: { [TERRAFORMING_TYPES.OXYGEN_LEVEL]: 1 },
    title: 'Greenery Count'
  },

  [TERRAFORMING_TYPES.OCEAN_COUNT]: {
    color: '#5B8BDD',
    image: ImageIconOcean,
    maximum: 9,
    minimum: 0,
    sideEffect: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Ocean Count'
  },

  [TERRAFORMING_TYPES.OXYGEN_LEVEL]: {
    color: '#FFF0B9',
    image: ImageIconOxygen,
    maximum: 14,
    minimum: 0,
    sideEffect: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Oxygen Level'
  },

  [TERRAFORMING_TYPES.TEMPERATURE]: {
    color: '#ED4E44',
    image: ImageIconTemperature,
    hideValue: true,
    maximum: 8,
    minimum: -30,
    sideEffect: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Temperature'
  }

};
