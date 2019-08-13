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

  GENERATION: 'generation',

  CARDS: 'cards',
  CITIES: 'cities',
  GREENERY: 'greenery',
  OCEANS: 'oceans',
  OXYGEN: 'oxygen',
  TEMPERATURE: 'temperature'
};

export const PROJECT_INFOS = {

  [PROJECT_TYPES.ADD_OCEAN]: {
    event: 'Add Ocean',
    countChanges: {
      [RESOURCE_TYPES.OCEANS]: 1
    },
    skipSideEffects: true
  },

  [PROJECT_TYPES.ADD_OXYGEN]: {
    event: 'Add Oxygen',
    countChanges: {
      [RESOURCE_TYPES.OXYGEN]: 1
    },
    skipSideEffects: true
  },

  [PROJECT_TYPES.ADD_TEMPERATURE]: {
    event: 'Add Temperature',
    countChanges: {
      [RESOURCE_TYPES.TEMPERATURE]: 2
    },
    skipSideEffects: true
  },

  [PROJECT_TYPES.BUY_ASTEROID]: {
    event: 'Buy Asteroid',
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -14,
      [RESOURCE_TYPES.TEMPERATURE]: 2,
    }
  },

  [PROJECT_TYPES.BUY_AQUIFER]: {
    event: 'Buy Aquifer',
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -18,
      [RESOURCE_TYPES.OCEANS]: 1,
    }
  },

  [PROJECT_TYPES.BUY_CITY]: {
    event: 'Buy City',
    countChanges: {
      [RESOURCE_TYPES.CITIES]: 1,
      [RESOURCE_TYPES.MEGACREDITS]: -25
    },
    productionChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: 1
    }
  },

  [PROJECT_TYPES.BUY_GREENERY]: {
    event: 'Buy Greenery',
    countChanges: {
      [RESOURCE_TYPES.GREENERY]: 1,
      [RESOURCE_TYPES.MEGACREDITS]: -23
    }
  },

  [PROJECT_TYPES.BUY_POWER_PLANT]: {
    event: 'Buy Power Plant',
    countChanges: {
      [RESOURCE_TYPES.MEGACREDITS]: -11
    },
    productionChanges: {
      [RESOURCE_TYPES.ENERGY]: 1
    }
  },

  [PROJECT_TYPES.SELL_PATENT]: {
    event: 'Sell Patent',
    countChanges: {
      [RESOURCE_TYPES.CARDS]: -1,
      [RESOURCE_TYPES.MEGACREDITS]: 1
    }
  },

  [PROJECT_TYPES.TRADE_HEAT]: {
    event: 'Trade Heat',
    countChanges: {
      [RESOURCE_TYPES.HEAT]: -8,
      [RESOURCE_TYPES.TEMPERATURE]: 2,
    }
  },

  [PROJECT_TYPES.TRADE_PLANTS]: {
    event: 'Trade Plants',
    countChanges: {
      [RESOURCE_TYPES.GREENERY]: 1,
      [RESOURCE_TYPES.PLANTS]: -8
    }
  }

};

export const RESOURCE_INFOS = {

  [RESOURCE_TYPES.TERRAFORMING_RATING]: {
    color: '#ED721F',
    hideIngredient: true,
    hideTitleInTracker: true,
    image: ImageIconTerraformingRating,
    title: 'Terraforming Rating',
    usePositiveCalculator: true,
    useSmallTracker: true
  },

  [RESOURCE_TYPES.MEGACREDITS]: {
    color: '#FFCC33',
    image: ImageIconMegacredits,
    minimumProduction: -5,
    title: 'MegaCredits'
  },

  [RESOURCE_TYPES.STEEL]: {
    color: '#B37D43',
    image: ImageIconSteel,
    multiplier: 2,
    title: 'Steel'
  },

  [RESOURCE_TYPES.TITANIUM]: {
    color: '#777777',
    image: ImageIconTitanium,
    multiplier: 3,
    title: 'Titanium'
  },

  [RESOURCE_TYPES.PLANTS]: {
    color: '#5FB365',
    image: ImageIconPlants,
    title: 'Plants'
  },

  [RESOURCE_TYPES.ENERGY]: {
    color: '#A34Cb8',
    image: ImageIconEnergy,
    title: 'Energy'
  },

  [RESOURCE_TYPES.HEAT]: {
    color: '#ED4E44',
    image: ImageIconHeat,
    minimumProduction: 0,
    multiplier: 1,
    title: 'Heat'
  },

  [RESOURCE_TYPES.GENERATION]: {
    button1Icon: 'bars',
    color: '#5B8BDD',
    hideIngredient: true,
    title: 'Generation',
    useDebounce: true,
    useSmallTracker: true
  },

  [RESOURCE_TYPES.CARDS]: {
    color: '#222222',
    image: ImageIconCard,
    title: 'Card'
  },

  [RESOURCE_TYPES.CITIES]: {
    color: '#777777',
    image: ImageIconCity,
    title: 'City Count'
  },

  [RESOURCE_TYPES.GREENERY]: {
    color: '#5FB365',
    image: ImageIconGreenery,
    sideEffects: { [RESOURCE_TYPES.OXYGEN]: 1 },
    title: 'Greenery Count'
  },

  [RESOURCE_TYPES.OCEANS]: {
    color: '#5B8BDD',
    image: ImageIconOcean,
    maximumCount: 9,
    minimumCount: 0,
    sideEffects: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Ocean Count'
  },

  [RESOURCE_TYPES.OXYGEN]: {
    color: '#FFF0B9',
    hideIngredient: true,
    image: ImageIconOxygen,
    maximumCount: 14,
    minimumCount: 0,
    sideEffects: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Oxygen Level'
  },

  [RESOURCE_TYPES.TEMPERATURE]: {
    color: '#ED4E44',
    image: ImageIconTemperature,
    hideValue: true,
    maximumCount: 8,
    minimumCount: -30,
    sideEffects: { [RESOURCE_TYPES.TERRAFORMING_RATING]: 1 },
    title: 'Temperature'
  }

};
