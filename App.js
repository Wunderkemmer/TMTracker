import React, { Component } from 'react';

import { Alert, Dimensions, SafeAreaView, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from './components/Button';
import Tracker, { TRACKER_TYPES } from './components/Tracker';

const { width, height } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: height > 375 ? 23 : width > 568 ? 16 : 12
});

type Props = {};

export default class App extends Component<Props> {

  defaultState = {

    terraformingRating: 20,
    generation: 1,

    resourceCount: {
      [TRACKER_TYPES.MEGACREDITS]: 20,
      [TRACKER_TYPES.STEEL]: 0,
      [TRACKER_TYPES.TITANIUM]: 0,
      [TRACKER_TYPES.PLANTS]: 0,
      [TRACKER_TYPES.ENERGY]: 0,
      [TRACKER_TYPES.HEAT]: 0
    },

    resourceRate: {
      [TRACKER_TYPES.MEGACREDITS]: 1,
      [TRACKER_TYPES.STEEL]: 1,
      [TRACKER_TYPES.TITANIUM]: 1,
      [TRACKER_TYPES.PLANTS]: 1,
      [TRACKER_TYPES.ENERGY]: 1,
      [TRACKER_TYPES.HEAT]: 1
    }

  };

  state = {};

  history = [];
  undoneHistory = [];

  componentWillMount () {
    this.reset();
  }

  reset = () => {
    const state = JSON.parse(JSON.stringify(this.defaultState));

    this.setState(state);
  };

  addHistory (event, payload) {
    this.history.push({ event, payload, state: JSON.parse(JSON.stringify(this.state)) });

    this.undoneHistory = [];
  }

  onDecrement = (type, addHistory = true) => {
    const state = this.state;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        state.terraformingRating = Math.max(state.terraformingRating - 1, 0);

        break;

      case TRACKER_TYPES.MEGACREDITS:
        state.resourceRate[type] = Math.max(state.resourceRate[type] - 1, -5);

        break;

      default:
        state.resourceRate[type] = Math.max(state.resourceRate[type] - 1, 0);
    }

    this.setState(state, () => {
      addHistory && this.addHistory('decrement', { type });
    });
  };

  onIncrement = (type, addHistory = true) => {
    const state = this.state;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        state.terraformingRating += 1;

        break;

      case TRACKER_TYPES.GENERATION:
        state.generation += 1;

        state.resourceCount[TRACKER_TYPES.MEGACREDITS] +=
          state.resourceRate[TRACKER_TYPES.MEGACREDITS] + state.terraformingRating;

        state.resourceCount[TRACKER_TYPES.HEAT] +=
          state.resourceRate[TRACKER_TYPES.HEAT] + state.resourceCount[TRACKER_TYPES.ENERGY];

        state.resourceCount[TRACKER_TYPES.ENERGY] = state.resourceRate[TRACKER_TYPES.ENERGY];
        state.resourceCount[TRACKER_TYPES.PLANTS] += state.resourceRate[TRACKER_TYPES.PLANTS];
        state.resourceCount[TRACKER_TYPES.STEEL] += state.resourceRate[TRACKER_TYPES.STEEL];
        state.resourceCount[TRACKER_TYPES.TITANIUM] += state.resourceRate[TRACKER_TYPES.TITANIUM];

        break;

      default:
        state.resourceRate[type] += 1;
    }

    this.setState(state, () => {
      addHistory && this.addHistory('increment', { type });
    });
  };

  onNewGame = () => {
    Alert.alert(
      'Do you really want to start a new game?',
      null,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: this.reset }
      ],
      'default'
    );
  };

  onPress = (type) => {
    // TODO: Show calculator

    console.log('Pressed', type);
  };

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.setState(historyItem.state);
    }
  };

  onUndo = () => {
    const count = this.history.length;

    if (count) {
      const historyItem = this.history.pop();

      this.undoneHistory.push(historyItem);

      if (count > 1) {
        this.setState(this.history[this.history.length - 1].state);

        return;
      }
    }

    this.reset();
  };

  renderButton = (color, text, onPress) => {
    return (
      <Button
        style={ styles.sidebarButton }
        color={ color }
        text={ text }
        onPress={ onPress }
      />
    );
  };

  renderTracker = (type) => {
    const { generation, resourceCount, resourceRate, terraformingRating } = this.state;

    let style;
    let count;
    let rate;
    let onDecrement;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        style = styles.flex;
        count = terraformingRating;
        onDecrement = this.onDecrement;

        break;

      case TRACKER_TYPES.GENERATION:
        style = styles.flex;
        count = generation;

        break;

      default:
        count = resourceCount[type];
        rate = resourceRate[type];
        onDecrement = this.onDecrement;
    }

    return (
      <Tracker
        key={ type }
        style={ style }
        type={ type }
        count={ count }
        rate={ rate }
        onPress={ this.onPress }
        onDecrement={ onDecrement }
        onIncrement={ this.onIncrement }
      />
    );
  };

  render () {
    return (
      <SafeAreaView style={ styles.safeAreaView }>
        <View style={ styles.container }>
          <View style={ styles.sidebar }>
            <View style={ styles.sidebarTracker }>
              { this.renderTracker(TRACKER_TYPES.TERRAFORMING_RATING) }
            </View>
            <View style={ styles.sidebarButtons }>
              { this.renderButton('#F45042', 'New Game', this.onNewGame) }
            </View>
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
            <View style={ styles.sidebarTracker }>
              { this.renderTracker(TRACKER_TYPES.GENERATION) }
            </View>
            <View style={ styles.sidebarButtons }>
              { this.renderButton('#F45042', 'Undo', this.onUndo) }
              { this.renderButton('#F45042', 'Redo', this.onRedo) }
            </View>
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

  flex: {
    flex: 1
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
    paddingVertical: '0.25rem'
  },

  sidebarButton: {
    maxHeight: '2.25rem'
  },

  sidebarButtons: {
    flex: 0.56
  },

  sidebarTracker: {
    flex: 0.44
  }

});
