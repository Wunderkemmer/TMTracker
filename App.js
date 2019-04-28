import AsyncStorage from '@react-native-community/async-storage';

import { cloneDeep } from 'lodash';

import React, { Component, Fragment } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import ImageMars from './resources/images/background_mars.jpg';
import ImageIconGreenery from './resources/images/icon_greenery.png';
import ImageIconOcean from './resources/images/icon_ocean.png';
import ImageIconOxygen from './resources/images/icon_oxygen.png';
import ImageIconTemperature from './resources/images/icon_temperature.png';

import Button from './src/components/Button';

import CalculatorPopup from './src/components/popups/CalculatorPopup';
import HistoryPopup from './src/components/popups/HistoryPopup';
import InfoPopup from './src/components/popups/InfoPopup';
import { Popup, Popups, showPopup } from './src/components/popups/Popups';
import ProjectsPopup from './src/components/popups/ProjectsPopup';

import Tracker, { TRACKER_TYPES } from './src/components/Tracker';
import TransactionButton from './src/components/TransactionButton';

const { width, height } = Dimensions.get('window');

const MAX_OCEAN_COUNT = 9;
const MAX_OXYGEN_LEVEL = 14;
const MAX_TEMPERATURE = 8;

ExtendedStyleSheet.build({
  $rem: width * 0.02
});

Text.defaultProps = Text.defaultProps || {};

Text.defaultProps.allowFontScaling = false;

type Props = {};

export default class App extends Component<Props> {

  defaultState = {
    generation: 1,
    oceanCount: 0,
    oxygenLevel: 0,
    temperature: -30,

    resourceCount: {
      [TRACKER_TYPES.TERRAFORMING_RATING]: 20,
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
    undoneHistoryCount: 0
  };

  state = {};

  isLoading = true;

  history = [];
  undoneHistory = [];

  componentDidMount () {
    AsyncStorage.getItem('gameHistory').then((history) => {
      this.isLoading = false;

      if (history) {
        history = JSON.parse(history);

        if (this.getIsGameInProgress(history)) {
          Alert.alert(
            'An in-progress game was found, do you want to restore it?',
            null,
            [
              { text: 'No', style: 'cancel', onPress: this.startGame },
              { text: 'Yes', onPress: () => this.restoreGame(history) }
            ],
            'default'
          );

          return;
        }
      }

      this.startGame();
    });
  }

  addHistoryAndSetState (state, event, payload) {
    this.history.push({ state, event, payload, time: Date.now() });

    this.undoneHistory = [];

    this.updateHistoryAndSetState(state);
  }

  getIsGameInProgress (history) {
    const lastEntry = history[history.length - 1];
    const lastEvent = lastEntry.event;
    const lastState = lastEntry.state;

    return lastEvent !== 'newGame' &&
      lastState.oceanCount < MAX_OCEAN_COUNT &&
      lastState.oxygenLevel < MAX_OXYGEN_LEVEL &&
      lastState.temperature < MAX_TEMPERATURE;
  }

  restoreGame = (history) => {
    this.history = history;

    const lastState = history[history.length - 1].state;

    this.updateHistoryAndSetState(lastState);
  };

  startGame = () => {
    const state = cloneDeep(this.defaultState);

    this.history = [];

    this.addHistoryAndSetState(state, 'newGame');
  };

  updateHistoryAndSetState (state) {
    state.historyCount = this.history.length;
    state.undoneHistoryCount = this.undoneHistory.length;

    this.setState(state);

    AsyncStorage.setItem('gameHistory', JSON.stringify(this.history));
  }

  onBuyTemperature = () => {
    let { state } = this;

    if (state.resourceCount[TRACKER_TYPES.HEAT] >= 8) {
      const newTemperature = Math.min(state.temperature + 2, MAX_TEMPERATURE);

      if (state.temperature !== newTemperature) {
        state = cloneDeep(state);

        state.temperature = newTemperature;
        state.resourceCount[TRACKER_TYPES.TERRAFORMING_RATING] += 1;
        state.resourceCount[TRACKER_TYPES.HEAT] -= 8;

        this.addHistoryAndSetState(state, 'buyTemperature');
      }
    }
  };

  onBuyGreenery = () => {
    let { state } = this;

    if (state.resourceCount[TRACKER_TYPES.PLANTS] >= 8) {
      state = cloneDeep(state);

      const newOxygenLevel = Math.min(state.oxygenLevel + 1, MAX_OXYGEN_LEVEL);

      if (state.oxygenLevel !== newOxygenLevel) {
        state.oxygenLevel = newOxygenLevel;

        state.resourceCount[TRACKER_TYPES.TERRAFORMING_RATING] += 1;
      }

      state.resourceCount[TRACKER_TYPES.PLANTS] -= 8;

      this.addHistoryAndSetState(state, 'buyGreenery');
    }
  };

  onDecrement = (type) => {
    const state = cloneDeep(this.state);

    let oldValue = null;
    let didSomething = false;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        oldValue = state.resourceCount[type];
        state.resourceCount[type] = Math.max(state.resourceCount[type] - 1, 0);
        didSomething = oldValue !== state.resourceCount[type];

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
      this.addHistoryAndSetState(state, 'decrement', { type });
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
    const state = cloneDeep(this.state);

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        state.resourceCount[type] += 1;

        break;

      case TRACKER_TYPES.GENERATION:
        state.generation += 1;

        state.resourceCount[TRACKER_TYPES.MEGACREDITS] +=
          state.resourceRate[TRACKER_TYPES.MEGACREDITS] +
          state.resourceCount[TRACKER_TYPES.TERRAFORMING_RATING];

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

    this.addHistoryAndSetState(state, 'increment', { type });
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

  onOcean = () => {
    let { state } = this;

    const newOceanCount = Math.min(state.oceanCount + 1, MAX_OCEAN_COUNT);

    if (state.oceanCount !== newOceanCount) {
      state = cloneDeep(state);

      state.oceanCount = newOceanCount;

      this.addHistoryAndSetState(state, 'oceanCount', { value: state.oceanCount });
    }
  };

  onOxygen = () => {
    let { state } = this;

    const newOxygenLevel = Math.min(state.oxygenLevel + 1, MAX_OXYGEN_LEVEL);

    if (state.oxygenLevel !== newOxygenLevel) {
      state = cloneDeep(state);

      state.oxygenLevel = newOxygenLevel;

      this.addHistoryAndSetState(state, 'oxygenLevel', { value: state.oxygenLevel });
    }
  };

  onProjects = () => {
    showPopup('projects');
  };

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.updateHistoryAndSetState(cloneDeep(historyItem.state));
    }
  };

  onTemperature = () => {
    let { state } = this;

    const newTemperature = Math.min(state.temperature + 2, MAX_TEMPERATURE);

    if (state.temperature !== newTemperature) {
      state = cloneDeep(state);

      state.temperature = newTemperature;

      this.addHistoryAndSetState(state, 'temperature', { value: state.temperature });
    }
  };

  onTracker = (type) => {
    if (type === TRACKER_TYPES.GENERATION) {
      this.onHistory();

      return;
    }

    showPopup('calculator', {
      state: this.state,
      type,
      onChange: (changes) => {
        const state = cloneDeep(this.state);

        changes.forEach((change) => {
          state.resourceCount[change.type] += change.value;
        });

        this.addHistoryAndSetState(state, 'calculation', { type, changes });
      }
    });
  };

  onUndo = () => {
    const length = this.history.length;

    if (length > 1) {
      const historyItem = this.history.pop();

      this.undoneHistory.push(historyItem);

      this.updateHistoryAndSetState(cloneDeep(this.history[length - 2].state));
    }
  };

  renderButton = (backgroundColor, icon, text, isDisabled, onPress) => {
    return (
      <Button
        style={ styles.button }
        backgroundColor={ backgroundColor }
        icon={ icon }
        text={ text }
        isDisabled={ isDisabled }
        onPress={ onPress }
      />
    );
  };

  renderTracker = (type) => {
    const { generation, resourceCount, resourceRate } = this.state;

    let style;
    let count;
    let rate;
    let onDecrement;
    let onIncrement;
    let onHistory;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        style = styles.trackerTiny;
        count = resourceCount[type];
        onDecrement = this.onDecrement;
        onIncrement = this.onIncrement;

        break;

      case TRACKER_TYPES.GENERATION:
        style = styles.trackerTiny;
        count = generation;
        onHistory = this.onHistory;
        onIncrement = this.onIncrement;

        break;

      default:
        style = styles.tracker;
        count = resourceCount[type];
        rate = resourceRate[type];
        onDecrement = this.onDecrement;
        onIncrement = this.onIncrement;
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
        onHistory={ onHistory }
        onIncrement={ onIncrement }
      />
    );
  };

  renderTransactionButton = (backgroundColor, image1, image2, icon, isDisabled, onPress) => {
    return (
      <TransactionButton
        style={ styles.button }
        backgroundColor={ backgroundColor }
        icon={ icon }
        image1={ image1 }
        image2={ image2 }
        isDisabled={ isDisabled }
        onPress={ onPress }
      />
    );
  };

  render () {
    if (this.isLoading) {
      return (
        <Image style={ styles.background } resizeMode="cover" source={ ImageMars } />
      );
    }

    const { oceanCount, oxygenLevel, resourceCount, temperature } = this.state;

    const plantsImage = Tracker.getTrackerInfo(TRACKER_TYPES.PLANTS).image;
    const heatImage = Tracker.getTrackerInfo(TRACKER_TYPES.HEAT).image;

    const isUndoDisabled = this.state.historyCount < 2;
    const isRedoDisabled = this.state.undoneHistoryCount < 1;

    const isBuyGreeneryDisabled =
      resourceCount[TRACKER_TYPES.PLANTS] < 8;

    const isBuyTemperatureDisabled =
      resourceCount[TRACKER_TYPES.HEAT] < 8 || temperature >= MAX_TEMPERATURE;

    const isOceanComplete = oceanCount >= MAX_OCEAN_COUNT;
    const isTemperatureComplete = temperature >= MAX_TEMPERATURE;
    const isOxygenComplete = oxygenLevel >= MAX_OXYGEN_LEVEL;

    const oceanTextStyle = isOceanComplete ?
      styles.toggleBottomTextComplete :
      styles.toggleBottomText;

    const temperatureTextStyle = isTemperatureComplete ?
      styles.toggleTopTextComplete :
      styles.toggleTopText;

    const oxygenTextStyle = isOxygenComplete ?
      styles.toggleBottomTextComplete :
      styles.toggleBottomText;

    const temperatureText = (temperature > 0 ? '+' + temperature : temperature) + '°';
    const oxygenLevelText = oxygenLevel + '%';

    return (
      <Fragment>
        <Image style={ styles.background } resizeMode="cover" source={ ImageMars } />
        <SafeAreaView style={ styles.safeAreaView }>
          <View style={ styles.container }>
            <View style={ styles.sidebar }>
              <View style={ styles.sidebarTracker }>
                { this.renderTracker(TRACKER_TYPES.TERRAFORMING_RATING) }
              </View>
              <View style={ styles.sidebarButtonsLeft }>
                <View style={ styles.sidebarButtonRow }>
                  { this.renderButton('#5B8BDD', 'undo-alt', null, isUndoDisabled, this.onUndo) }
                  { this.renderButton('#5B8BDD', 'redo-alt', null, isRedoDisabled, this.onRedo) }
                </View>
                <View style={ styles.sidebarButtonRow }>
                  { this.renderButton('#5B8BDD', 'info-circle', null, false, this.onInfo) }
                  { this.renderButton('#5B8BDD', 'file', null, false, this.onNewGame) }
                </View>
                <View style={ styles.flex } />
                <View style={ styles.sidebarToggleRow }>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onOcean } disabled={ isOceanComplete }>
                      <Image style={ styles.toggleOcean } source={ ImageIconOcean } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ this.onOcean } disabled={ isOceanComplete }>
                      <Text style={ oceanTextStyle }>{ oceanCount }</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onTemperature } disabled={ isTemperatureComplete }>
                      <Text style={ temperatureTextStyle }>{ temperatureText }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ this.onTemperature } disabled={ isTemperatureComplete }>
                      <Image style={ styles.toggleTemperature } source={ ImageIconTemperature } />
                    </TouchableOpacity>
                  </View>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onOxygen } disabled={ isOxygenComplete }>
                      <Image style={ styles.toggleOxygen } source={ ImageIconOxygen } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ this.onOxygen } disabled={ isOxygenComplete }>
                      <Text style={ oxygenTextStyle }>{ oxygenLevelText }</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
              <View style={ styles.sidebarButtonsRight }>
                { this.renderTransactionButton('#5FB365', plantsImage, ImageIconGreenery, 'arrow-right', isBuyGreeneryDisabled, this.onBuyGreenery) }
                { this.renderTransactionButton('#ED4E44', heatImage, ImageIconTemperature, 'arrow-right', isBuyTemperatureDisabled, this.onBuyTemperature) }
                { this.renderButton('#5B8BDD', null, 'Projects', false, this.onProjects) }
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

  button: {
    maxHeight: '2.6rem',
    minHeight: '2.6rem',
    margin: '0.2rem'
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
    flex: 4,
    paddingVertical: '0.25rem'
  },

  resourcesRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  safeAreaView: {
    flex: 1
  },

  sidebar: {
    flex: 1,
    paddingVertical: '0.25rem'
  },

  sidebarButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  sidebarButtonsLeft: {
    flex: 1
  },

  sidebarButtonsRight: {
    flex: 1
  },

  sidebarToggleColumn: {
    alignItems: 'center'
  },

  sidebarToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '0.2rem',
    marginBottom: '0.25rem',
    marginHorizontal: '0.35rem'
  },

  sidebarTracker: {
    flex: 1,
    maxHeight: '10rem'
  },

  toggleOcean: {
    width: '2.35rem',
    height: '2.35rem',
    marginTop: '1rem'
  },

  toggleOxygen: {
    width: '2.35rem',
    height: '2.35rem',
    marginTop: '1rem'
  },

  toggleTemperature: {
    width: '1.5rem',
    height: '3rem',
    marginTop: '0.4rem'
  },

  toggleTopText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginHorizontal: '-1rem'
  },

  toggleTopTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginHorizontal: '-1rem'
  },

  toggleBottomText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '0.4rem'
  },

  toggleBottomTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginTop: '0.4rem'
  },

  tracker: {
    margin: '0.2rem'
  },

  trackerTiny: {
    flex: 1,
    margin: '0.2rem'
  }

});
