import ImageIconEnergy from '../../../resources/images/icon_energy.png';
import ImageIconHeat from '../../../resources/images/icon_heat.png';
import ImageIconMegaCredits from '../../../resources/images/icon_mega_credits.png';
import ImageIconPlants from '../../../resources/images/icon_plants.png';
import ImageIconSteel from '../../../resources/images/icon_steel.png';
import ImageIconTerraformingRating from '../../../resources/images/icon_terraforming_rating.png';
import ImageIconTitanium from '../../../resources/images/icon_titanium.png';

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

export const RESOURCE_INFOS = {

  terraformingRating: {
    color: '#ED721F',
    hideTitleInTracker: true,
    image: ImageIconTerraformingRating,
    minProduction: 0,
    title: 'Terraforming Rating',
    usePositiveCalculator: true,
    useSmallTracker: true
  },

  megacredits: {
    color: '#FFCC33',
    image: ImageIconMegaCredits,
    minProduction: -5,
    title: 'MegaCredits'
  },

  steel: {
    color: '#B37D43',
    image: ImageIconSteel,
    minProduction: 0,
    multiplier: 2,
    title: 'Steel'
  },

  titanium: {
    color: '#777777',
    image: ImageIconTitanium,
    minProduction: 0,
    multiplier: 3,
    title: 'Titanium'
  },

  plants: {
    color: '#5FB365',
    image: ImageIconPlants,
    minProduction: 0,
    title: 'Plants'
  },

  energy: {
    color: '#A34Cb8',
    image: ImageIconEnergy,
    minProduction: 0,
    title: 'Energy'
  },

  heat: {
    color: '#ED4E44',
    image: ImageIconHeat,
    minProduction: 0,
    multiplier: 1,
    title: 'Heat'
  },

  generation: {
    button1Icon: 'bars',
    color: '#5B8BDD',
    minProduction: 0,
    title: 'Generation',
    useDebounce: true,
    useSmallTracker: true
  }

};