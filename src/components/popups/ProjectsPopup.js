import React, { Component } from 'react';

import { View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from '../Button';
import { TRACKER_TYPES } from '../Tracker';

import { contants } from '../../../src/lib/utils';

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
    hasRunOut: (state) => state.temperature >= contants.MAX_TEMPERATURE
  },
  [PROJECT_TYPES.BUY_AQUIFER]: {
    title: 'Buy Aquifer',
    cost: 18,
    hasRunOut: (state) => state.oceanCount >= contants.MAX_OCEAN_COUNT
  },
  [PROJECT_TYPES.BUY_CITY]: { title: 'Buy City', cost: 25 },
  [PROJECT_TYPES.BUY_GREENERY]: { title: 'Buy Greenery', cost: 23 },
  [PROJECT_TYPES.BUY_POWER_PLANT]: { title: 'Buy Power Plant', cost: 11 },
  [PROJECT_TYPES.SELL_PATENT]: { title: 'Sell Patent', cost: -1 }
};

export default class ProjectsPopup extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      maxHeight: '24rem'
    }
  });

  onProject = (type, cost) => {
    const { dismiss, onProject } = this.props;

    dismiss();

    onProject(type, cost);
  };

  renderButton (type) {
    const { state } = this.props;

    const info = PROJECT_INFOS[type];
    const megaCredits = state.resourceCount[TRACKER_TYPES.MEGACREDITS];
    const isTooExpensive = info.cost > 0 && megaCredits < info.cost;
    const hasRunOut = info.hasRunOut && info.hasRunOut(state);

    return (
      <Button
        style={ styles.button }
        backgroundColor="#5B8BDD"
        text={ info.title }
        textStyle={ styles.buttonText }
        isDisabled={ isTooExpensive || hasRunOut }
        onPress={ () => this.onProject(type, info.cost) }
      />
    );
  }

  render () {
    return (
      <View style={ styles.container }>
        <View style={ styles.buttonColumn }>
          { this.renderButton(PROJECT_TYPES.SELL_PATENT) }
          { this.renderButton(PROJECT_TYPES.BUY_ASTEROID) }
          { this.renderButton(PROJECT_TYPES.BUY_GREENERY) }
        </View>
        <View style={ styles.buttonColumn }>
          { this.renderButton(PROJECT_TYPES.BUY_POWER_PLANT) }
          { this.renderButton(PROJECT_TYPES.BUY_AQUIFER) }
          { this.renderButton(PROJECT_TYPES.BUY_CITY) }
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
    paddingHorizontal: '2rem',
    paddingVertical: '1.75rem'
  }

});
