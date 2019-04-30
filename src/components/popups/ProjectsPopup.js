import React, { Component } from 'react';

import { View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { contants } from '../../../src/lib/utils';

import ImageIconCard from '../../../resources/images/icon_card.png';
import ImageIconCity from '../../../resources/images/icon_city.png';
import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconOcean from '../../../resources/images/icon_ocean.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

import ProjectButton from '../ProjectButton';
import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

export const PROJECT_TYPES = {
  BUY_ASTEROID: 'buyAsteroid',
  BUY_AQUIFER: 'buyAquifer',
  BUY_CITY: 'buyCity',
  BUY_GREENERY: 'buyGreenery',
  BUY_POWER_PLANT: 'buyPowerPlant',
  SELL_PATENT: 'sellPatent'
};

export const PROJECT_INFOS = {
  [PROJECT_TYPES.BUY_ASTEROID]: {
    title: 'Buy Asteroid',
    cost: 14,
    image1: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image2: ImageIconTemperature,
    hasRunOut: (state) => state.temperature >= contants.MAX_TEMPERATURE
  },
  [PROJECT_TYPES.BUY_AQUIFER]: {
    title: 'Buy Aquifer',
    cost: 18,
    image1: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image2: ImageIconOcean,
    hasRunOut: (state) => state.oceanCount >= contants.MAX_OCEAN_COUNT
  },
  [PROJECT_TYPES.BUY_CITY]: {
    title: 'Buy City',
    cost: 25,
    image1: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image2: ImageIconCity,
    image3: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image3IsProduction: true,
  },
  [PROJECT_TYPES.BUY_GREENERY]: {
    title: 'Buy Greenery',
    cost: 23,
    image1: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image2: ImageIconGreenery,
  },
  [PROJECT_TYPES.BUY_POWER_PLANT]: {
    title: 'Buy Power Plant',
    cost: 11,
    image1: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
    image2: TRACKER_INFOS[TRACKER_TYPES.ENERGY].image,
    image2IsProduction: true,
  },
  [PROJECT_TYPES.SELL_PATENT]: {
    title: 'Sell Patent',
    cost: -1,
    image1: ImageIconCard,
    image2: TRACKER_INFOS[TRACKER_TYPES.MEGACREDITS].image,
  }
};

export default class ProjectsPopup extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      maxHeight: '24rem'
    }
  });

  renderProjectButton (type) {
    const { onProject, state } = this.props;

    const info = PROJECT_INFOS[type];
    const megaCredits = state.resourceCount[TRACKER_TYPES.MEGACREDITS];
    const isTooExpensive = info.cost > 0 && megaCredits < info.cost;
    const hasRunOut = info.hasRunOut && info.hasRunOut(state);

    return (
      <ProjectButton
        style={ styles.button }
        backgroundColor="#5B8BDD"
        cost={ info.cost }
        icon="arrow-right"
        image1={ info.image1 }
        image2={ info.image2 }
        image2IsProduction={ info.image2IsProduction }
        image3={ info.image3 }
        image3IsProduction={ info.image3IsProduction }
        isDisabled={ isTooExpensive || hasRunOut }
        text={ info.title }
        textStyle={ styles.buttonText }
        onPress={ () => onProject(type, info.cost) }
      />
    );
  }

  render () {
    return (
      <View style={ styles.container }>
        <View style={ styles.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.SELL_PATENT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_ASTEROID) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_GREENERY) }
        </View>
        <View style={ styles.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.BUY_POWER_PLANT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_AQUIFER) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_CITY) }
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  button: {
    flex: 1,
    margin: '0.2rem'
  },

  buttonColumn: {
    flex: 1
  },

  buttonText: {
    fontSize: '1rem',
    color: '#FFFFFF'
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '1rem'
  }

});
