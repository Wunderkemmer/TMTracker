import React, { Component } from 'react';

import { Dimensions, SafeAreaView, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Counter, { COUNTER_TYPES } from './components/Counter';
import Tracker, { TRACKER_TYPES } from './components/Tracker';

const { width, height } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: height > 375 ? 23 : width > 568 ? 16 : 12
});

type Props = {};

export default class App extends Component<Props> {

  defaultState = {

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

  state = { ...this.defaultState };

  onCounterDown = (type) => {
    const state = this.state;

    if (type === COUNTER_TYPES.TERRAFORM_RATING) {
      state.terraformRating -= 1;
    } else {
      state.generation -= 1;
    }

    this.setState(state);
  };

  onCounterUp = (type) => {
    const state = this.state;

    if (type === COUNTER_TYPES.TERRAFORM_RATING) {
      state.terraformRating += 1;
    } else {
      state.generation += 1;

      state.resourceCount[TRACKER_TYPES.MEGACREDITS] +=
        state.resourceProduction[TRACKER_TYPES.MEGACREDITS] + state.terraformRating;

      state.resourceCount[TRACKER_TYPES.STEEL] +=
        state.resourceProduction[TRACKER_TYPES.STEEL];

      state.resourceCount[TRACKER_TYPES.TITANIUM] +=
        state.resourceProduction[TRACKER_TYPES.TITANIUM];

      state.resourceCount[TRACKER_TYPES.PLANTS] +=
        state.resourceProduction[TRACKER_TYPES.PLANTS];

      state.resourceCount[TRACKER_TYPES.HEAT] +=
        state.resourceProduction[TRACKER_TYPES.HEAT] + state.resourceCount[TRACKER_TYPES.ENERGY];

      state.resourceCount[TRACKER_TYPES.ENERGY] =
        state.resourceProduction[TRACKER_TYPES.ENERGY];
    }

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

  renderCounter = (type) => {
    let count = type === COUNTER_TYPES.TERRAFORM_RATING ?
      this.state.terraformRating :
      this.state.generation;

    let onCounterDown = type === COUNTER_TYPES.TERRAFORM_RATING ? this.onCounterDown : null;

    return (
      <Counter
        key={ type }
        type={ type }
        count={ count }
        onCounterDown={ onCounterDown }
        onCounterUp={ this.onCounterUp }
      />
    );
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
      <SafeAreaView style={ styles.safeAreaView }>
        <View style={ styles.container }>
          <View style={ styles.sidebar }>
            { this.renderCounter(COUNTER_TYPES.TERRAFORM_RATING) }
          </View>
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
          <View style={ styles.sidebar }>
            { this.renderCounter(COUNTER_TYPES.GENERATION) }
          </View>
        </View>
      </SafeAreaView>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: '0.25rem'
  },

  resources: {
    flex: 4.65,
    paddingVertical: '0.25rem'
  },

  resourcesRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  safeAreaView: {
    backgroundColor: '#C18C6A',
    flex: 1
  },

  sidebar: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  }

});
