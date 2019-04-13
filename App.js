import React, { Component } from 'react';

import { SafeAreaView, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Tracker, { TRACKER_TYPES } from './components/Tracker';

const resourceDisplayOrder = [
  TRACKER_TYPES.MEGACREDITS,
  TRACKER_TYPES.STEEL,
  TRACKER_TYPES.TITANIUM,
  TRACKER_TYPES.PLANTS,
  TRACKER_TYPES.ENERGY,
  TRACKER_TYPES.HEAT
];

ExtendedStyleSheet.build({
  $textColor: '#0275d8'
});

type Props = {};

export default class App extends Component<Props> {

  state = {

    generation: 1,

    resourceCount: {
      [TRACKER_TYPES.MEGACREDITS]: 20,
      [TRACKER_TYPES.STEEL]: 0,
      [TRACKER_TYPES.TITANIUM]: 0,
      [TRACKER_TYPES.PLANTS]: 0,
      [TRACKER_TYPES.ENERGY]: 0,
      [TRACKER_TYPES.HEAT]: 0
    },

    resourceProduction: {
      [TRACKER_TYPES.MEGACREDITS]: 1,
      [TRACKER_TYPES.STEEL]: 1,
      [TRACKER_TYPES.TITANIUM]: 1,
      [TRACKER_TYPES.PLANTS]: 1,
      [TRACKER_TYPES.ENERGY]: 1,
      [TRACKER_TYPES.HEAT]: 1
    },

    terraformRating: 20
  };

  onGenerationUp = (type) => {
    const state = this.state;

    state.resourceProduction[type] += 1;

    this.setState(state);
  };

  onProductionDown = (type) => {
    const state = this.state;

    state.resourceProduction[type] -= 1;

    this.setState(state);
  };

  onProductionUp = (type) => {
    const state = this.state;

    state.resourceProduction[type] += 1;

    this.setState(state);
  };

  onTerraformRatingDown = (type) => {
    const state = this.state;

    state.terraformRating -= 1;

    this.setState(state);
  };

  onTerraformRatingUp = (type) => {
    const state = this.state;

    state.terraformRating[type] += 1;

    this.setState(state);
  };

  renderTracker = (type) => {
    const count = this.state.resourceCount[type];
    const production = this.state.resourceProduction[type];

    return (
      <Tracker
        key={ type }
        type={ type }
        count={ count }
        production={ production }
        onProductionDown={ this.onProductionDown }
        onProductionUp={ this.onProductionUp }
      />
    );
  };

  render () {
    return (
      <SafeAreaView style={ styles.container }>
        <View style={ styles.resources }>
          <View style={ styles.resourcesRow }>
            { this.renderTracker(TRACKER_TYPES.MEGACREDITS) }
            { this.renderTracker(TRACKER_TYPES.STEEL) }
            { this.renderTracker(TRACKER_TYPES.TITANIUM) }
          </View>
          <View style={ styles.resourcesRow }>
            { this.renderTracker(TRACKER_TYPES.PLANTS) }
            { this.renderTracker(TRACKER_TYPES.ENERGY) }
            { this.renderTracker(TRACKER_TYPES.HEAT) }
          </View>
        </View>
      </SafeAreaView>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    backgroundColor: '#C18C6A',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  resources: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem'
  },

  resourcesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }

});
