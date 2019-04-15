import React, { Component, Fragment } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from './components/Button';

import CalculatorPopup from './components/popups/CalculatorPopup';
import HistoryPopup from './components/popups/HistoryPopup';
import InfoPopup from './components/popups/InfoPopup';
import { Popup, Popups, showPopup } from './components/popups/Popups';
import ProjectsPopup from './components/popups/ProjectsPopup';

import Tracker, { TRACKER_TYPES } from './components/Tracker';
import TransactionButton from './components/TransactionButton';
import ImageMars from './resources/images/background_mars.jpg';

import ImageIconGreenery from './resources/images/icon_greenery.png';
import ImageIconTemperature from './resources/images/icon_temperature.png';

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
    },

    historyCount: 0,
    undoneHistoryCount: 0,

  };

  state = {};

  history = [];
  undoneHistory = [];

  componentWillMount () {
    this.startGame();
  }

  addHistory (event, payload) {
    const state = JSON.parse(JSON.stringify(this.state));

    this.history.push({ event, payload, state });

    this.undoneHistory = [];

    this.updateHistory(state);
  }

  updateHistory (state) {
    state = JSON.parse(JSON.stringify(state));

    state.historyCount = this.history.length;
    state.undoneHistoryCount = this.undoneHistory.length;

    this.setState(state);
  }

  startGame = () => {
    const state = JSON.parse(JSON.stringify(this.defaultState));

    this.setState(state, () => this.addHistory('newGame'));
  };

  onBuyTemperature = () => {
    if (this.state.resourceCount[TRACKER_TYPES.HEAT] >= 8) {
      const state = JSON.parse(JSON.stringify(this.state));

      state.terraformingRating += 1;
      state.resourceCount[TRACKER_TYPES.HEAT] -= 8;

      this.setState(state, () => this.addHistory('buyTemperature'));
    }
  };

  onBuyGreenery = () => {
    if (this.state.resourceCount[TRACKER_TYPES.PLANTS] >= 8) {
      const state = JSON.parse(JSON.stringify(this.state));

      state.terraformingRating += 1;
      state.resourceCount[TRACKER_TYPES.PLANTS] -= 8;

      this.setState(state, () => this.addHistory('buyGreenery'));
    }
  };

  onBuyWithSteel = () => {
    // TODO: Buy card with megacredits and steel

    console.log('onBuyWithSteel');
  };

  onBuyWithTitanium = () => {
    // TODO: Buy card with megacredits and titanium

    console.log('onBuyWithTitanium');
  };

  onDecrement = (type) => {
    const state = JSON.parse(JSON.stringify(this.state));

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
      this.setState(state, () => this.addHistory('decrement', { type }));
    }
  };

  onHistory = () => {
    const { history } = this;

    showPopup('history', { history });
  };

  onInfo = () => {
    showPopup('info');
  };

  onIncrement = (type) => {
    const state = JSON.parse(JSON.stringify(this.state));

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

    this.setState(state, () => this.addHistory('increment', { type }));
  };

  onNewGame = () => {
    Alert.alert(
      'Do you really want to start a new game?',
      null,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: this.startGame }
      ],
      'default'
    );
  };

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.updateHistory(historyItem.state);
    }
  };

  onTracker = (type) => {
    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
      case TRACKER_TYPES.GENERATION:
        this.onHistory();
        break;

      default:
        showPopup('calculator', {
          state: this.state,
          type,
          onChange: (change) => {
            const state = JSON.parse(JSON.stringify(this.state));

            state.resourceCount[type] += change;

            this.setState(state, () => this.addHistory('calculation', { type, change }));
          }
        });
    }
  };

  onProjects = () => {
    showPopup('projects');
  };

  onUndo = () => {
    const length = this.history.length;

    if (length) {
      if (this.history[length - 1].event === 'newGame') {
        return;
      }

      const historyItem = this.history.pop();

      this.undoneHistory.push(historyItem);

      this.updateHistory(this.history[length - 2].state);
    }
  };

  renderButton = (backgroundColor, icon, text, isDisabled, onPress, color) => {
    return (
      <Button
        backgroundColor={ backgroundColor }
        color={ color }
        icon={ icon }
        text={ text }
        isDisabled={ isDisabled }
        onPress={ onPress }
      />
    );
  };

  renderTransactionButton = (backgroundColor, image1, image2, icon, isDisabled, onPress) => {
    return (
      <TransactionButton
        backgroundColor={ backgroundColor }
        icon={ icon }
        image1={ image1 }
        image2={ image2 }
        isDisabled={ isDisabled }
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
        onPress={ this.onTracker }
        onDecrement={ onDecrement }
        onIncrement={ this.onIncrement }
      />
    );
  };

  render () {
    const megacreditsIcon = Tracker.getTrackerInfo(TRACKER_TYPES.MEGACREDITS).icon;
    const steelIcon = Tracker.getTrackerInfo(TRACKER_TYPES.STEEL).icon;
    const titanmiumIcon = Tracker.getTrackerInfo(TRACKER_TYPES.TITANIUM).icon;
    const plantsIcon = Tracker.getTrackerInfo(TRACKER_TYPES.PLANTS).icon;
    const heatIcon = Tracker.getTrackerInfo(TRACKER_TYPES.HEAT).icon;

    const isUndoDisabled = this.state.historyCount < 2;
    const isRedoDisabled = !this.state.undoneHistoryCount;
    const isMCAndSteelDisabled = !this.state.resourceCount[TRACKER_TYPES.STEEL];
    const isMCAndTitanumDisabled = !this.state.resourceCount[TRACKER_TYPES.TITANIUM];
    const isBuyGreeneryDisabled = this.state.resourceCount[TRACKER_TYPES.PLANTS] < 8;
    const isBuyTemperatureDisabled = this.state.resourceCount[TRACKER_TYPES.HEAT] < 8;

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
                <View style={ styles.sidebarButtonRow }>
                  { this.renderButton('#5B8BDD', 'undo-alt', null, isUndoDisabled, this.onUndo) }
                  { this.renderButton('#5B8BDD', 'redo-alt', null, isRedoDisabled, this.onRedo) }
                </View>
                <View style={ styles.sidebarButtonRow }>
                  { this.renderButton('#5B8BDD', 'info-circle', null, false, this.onInfo) }
                  { this.renderButton('#5B8BDD', 'list-ul', null, false, () => this.onHistory(true)) }
                </View>
                { this.renderButton('#5B8BDD', null, 'New Game', false, this.onNewGame) }
                { this.renderButton('#FFCC33', null, 'Projects', false, this.onProjects, '#222222') }
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
                { this.renderTransactionButton('#FFCC33', megacreditsIcon, steelIcon, 'plus', isMCAndSteelDisabled, this.onBuyWithSteel) }
                { this.renderTransactionButton('#FFCC33', megacreditsIcon, titanmiumIcon, 'plus', isMCAndTitanumDisabled, this.onBuyWithTitanium) }
                { this.renderTransactionButton('#5FB365', plantsIcon, ImageIconGreenery, 'arrow-right', isBuyGreeneryDisabled, this.onBuyGreenery) }
                { this.renderTransactionButton('#ED4E44', heatIcon, ImageIconTemperature, 'arrow-right', isBuyTemperatureDisabled, this.onBuyTemperature) }
              </View>
            </View>
          </View>
          <Popups>
            <Popup
              id="calculator"
              title="Calculator"
              component={ CalculatorPopup }
              style={ CalculatorPopup.publicStyles.popup }
            />
            <Popup
              id="history"
              title="Game History"
              component={ HistoryPopup }
            />
            <Popup
              id="info"
              title="TM Tracker"
              component={ InfoPopup }
            />
            <Popup
              id="projects"
              title="Projects"
              component={ ProjectsPopup }
            />
          </Popups>
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

  sidebarButtonRow: {
    flex: 1.25,
    flexDirection: 'row'
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
