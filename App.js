import { debounce } from 'lodash'

import React, { Component, Fragment } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from './components/Button';
import History from './components/History';
import Tracker, { TRACKER_TYPES } from './components/Tracker';

import ImageMars from './resources/images/background_mars.jpg';

const { width, height } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: height > 375 ? 23 : width > 568 ? 16 : 12
});

type Props = {};

export default class App extends Component<Props> {

  defaultState = {

    generation: 1,
    isShowingHistory: false,
    terraformingRating: 20,

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

    this.setState(state, () => this.addHistory('newGame'));
  };

  addHistory (event, payload) {
    this.history.push({ event, payload, state: JSON.parse(JSON.stringify(this.state)) });

    this.undoneHistory = [];
  }

  onBuyHeat = () => {
    // TODO: Buy heat
  };

  onBuyGreenery = () => {
    // TODO: Buy greenery
  };

  onBuyWithSteel = () => {
    // TODO: Buy card with megacredits and steel
  };

  onBuyWithTitanium = () => {
    // TODO: Buy card with megacredits and titanium
  };

  onDecrement = (type, addHistory = true) => {
    const state = this.state;

    let oldValue = null;
    let didSomething = false;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        oldValue = state.terraformingRating;

        state.terraformingRating = Math.max(state.terraformingRating - 1, 0);

        didSomething = oldValue !== state.terraformingRating;

        break;

      case TRACKER_TYPES.MEGACREDITS:
        oldValue = state.resourceRate[type];

        state.resourceRate[type] = Math.max(state.resourceRate[type] - 1, -5);

        didSomething = oldValue !== state.resourceRate[type];

        break;

      default:
        oldValue = state.resourceRate[type];

        state.resourceRate[type] = Math.max(state.resourceRate[type] - 1, 0);

        didSomething = oldValue !== state.resourceRate[type];
    }

    if (didSomething) {
      this.setState(state, () => {
        addHistory && this.addHistory('decrement', { type });
      });
    }
  };

  onHistory = debounce((isShowingHistory) => {
    const state = this.state;

    state.isShowingHistory = isShowingHistory;

    this.setState(state)
  }, 250, { leading: true, trailing: false });

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

  onNewGame = debounce(() => {
    Alert.alert(
      'Do you really want to start a new game?',
      null,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: this.reset }
      ],
      'default'
    );
  }, 250, { leading: true, trailing: true });

  onPress = debounce((type) => {
    // TODO: Show calculator

    console.log('Pressed', type);
  }, 250, { leading: true, trailing: true });

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.setState(historyItem.state);
    }
  };

  onUndo = () => {
    const count = this.history.length;

    if (count > 1) {
      const historyItem = this.history.pop();

      this.undoneHistory.push(historyItem);

      this.setState(this.history[this.history.length - 1].state);

      return;
    }
  };

  renderButton = (color, text, onPress) => {
    return (
      <Button
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
    const { isShowingHistory } = this.state;

    return (
      <Fragment>
        <Image style={ styles.background } resizeMode="cover" source={ ImageMars } />
        <SafeAreaView style={ styles.safeAreaView }>
          <View style={ styles.container }>
            <View style={ styles.sidebar }>
              <View style={ styles.sidebarTracker }>
                { this.renderTracker(TRACKER_TYPES.TERRAFORMING_RATING) }
              </View>
              <View style={ styles.sidebarButtons }>
                { this.renderButton('#F45042', 'New Game', this.onNewGame) }
                { this.renderButton('#F45042', 'History', () => this.onHistory(true)) }
                { this.renderButton('#F45042', 'Undo', this.onUndo) }
                { this.renderButton('#F45042', 'Redo', this.onRedo) }
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
                { this.renderButton('#FFCC33', 'MC & S', this.onBuyWithSteel) }
                { this.renderButton('#FFCC33', 'MC & T', this.onBuyWithTitanium) }
                { this.renderButton('#FFCC33', 'Greenery', this.onBuyGreenery) }
                { this.renderButton('#FFCC33', 'Heat', this.onBuyHeat) }
              </View>
            </View>
          </View>
          <History
            history={ this.history }
            isShowingHistory={ isShowingHistory }
            dismiss={ () => this.onHistory(false) }
          />
        </SafeAreaView>
      </Fragment>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%'
  },

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
    // backgroundColor: '#C18C6A',
    flex: 1
  },

  sidebar: {
    flex: 1,
    paddingVertical: '0.25rem'
  },

  sidebarButtons: {
    flex: 0.56,
    maxHeight: '12rem'
  },

  sidebarTracker: {
    flex: 0.44,
    maxHeight: '12rem'
  }

});
