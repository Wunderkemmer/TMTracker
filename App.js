import { cloneDeep } from 'lodash';

import React, { Component, Fragment } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from './src/components/Button';

import CalculatorPopup from './src/components/popups/CalculatorPopup';
import HistoryPopup from './src/components/popups/HistoryPopup';
import InfoPopup from './src/components/popups/InfoPopup';
import { Popup, Popups, showPopup } from './src/components/popups/Popups';
import ProjectsPopup from './src/components/popups/ProjectsPopup';

import Tracker, { TRACKER_TYPES } from './src/components/Tracker';
import TransactionButton from './src/components/TransactionButton';
import ImageMars from './resources/images/background_mars.jpg';

import ImageIconGreenery from './resources/images/icon_greenery.png';
import ImageIconOcean from './resources/images/icon_ocean.png';
import ImageIconOxygen from './resources/images/icon_oxygen.png';
import ImageIconTemperature from './resources/images/icon_temperature.png';

const { width, height } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: width * 0.02
});

console.log('Dimensions:', width, height);

type Props = {};

export default class App extends Component<Props> {

  defaultState = {

    generation: 1,
    terraformingRating: 20,

    oceanCount: 0,
    oxygenLevel: 0,
    temperature: -30,

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
    undoneHistoryCount: 0

  };

  state = {};

  history = [];
  undoneHistory = [];

  componentWillMount () {
    this.startGame();
  }

  addHistoryAndSetState (state, event, payload) {
    this.history.push({ state, event, payload, time: Date.now() });

    this.undoneHistory = [];

    this.updateHistoryCountsAndSetState(state, false);
  }

  updateHistoryCountsAndSetState (state) {
    state.historyCount = this.history.length;
    state.undoneHistoryCount = this.undoneHistory.length;

    this.setState(state);
  }

  startGame = () => {
    const state = cloneDeep(this.defaultState);

    this.addHistoryAndSetState(state, 'newGame');
  };

  onBuyTemperature = () => {
    if (this.state.resourceCount[TRACKER_TYPES.HEAT] >= 8) {
      const state = cloneDeep(this.state);

      state.terraformingRating += 1;
      state.resourceCount[TRACKER_TYPES.HEAT] -= 8;

      this.addHistoryAndSetState(state, 'buyTemperature');
    }
  };

  onBuyGreenery = () => {
    if (this.state.resourceCount[TRACKER_TYPES.PLANTS] >= 8) {
      const state = cloneDeep(this.state);

      state.terraformingRating += 1;
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
    const state = cloneDeep(this.state);

    state.oceanCount = Math.min(state.oceanCount + 1, 9);

    this.addHistoryAndSetState(state, 'oceanCount', { oceanCount: state.oceanCount });
  };

  onOxygen = () => {
    const state = cloneDeep(this.state);

    state.oxygenLevel = Math.min(state.oxygenLevel + 1, 14);

    this.addHistoryAndSetState(state, 'oxygenLevel', { oxygenLevel: state.oxygenLevel });
  };

  onProjects = () => {
    showPopup('projects');
  };

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.updateHistoryCountsAndSetState(cloneDeep(historyItem.state));
    }
  };

  onTemperature = () => {
    const state = cloneDeep(this.state);

    state.temperature = Math.min(state.temperature + 2, 8);

    this.addHistoryAndSetState(state, 'temperature', { temperature: state.temperature });
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
            const state = cloneDeep(this.state);

            state.resourceCount[type] += change;

            this.addHistoryAndSetState(state, 'calculation', { type, change });
          }
        });
    }
  };

  onUndo = () => {
    const length = this.history.length;

    if (length) {
      if (this.history[length - 1].event === 'newGame') {
        return;
      }

      const historyItem = this.history.pop();

      this.undoneHistory.push(historyItem);

      this.updateHistoryCountsAndSetState(cloneDeep(this.history[length - 2].state));
    }
  };

  renderButton = (backgroundColor, icon, text, isDisabled, onPress) => {
    return (
      <Button
        backgroundColor={ backgroundColor }
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
    let onHistory;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
        style = styles.flex;
        count = terraformingRating;
        onDecrement = this.onDecrement;

        break;

      case TRACKER_TYPES.GENERATION:
        style = styles.flex;
        count = generation;
        onHistory = this.onHistory;

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
        onHistory={ onHistory }
        onIncrement={ this.onIncrement }
      />
    );
  };

  render () {
    const { oceanCount, oxygenLevel, temperature } = this.state;

    const plantsIcon = Tracker.getTrackerInfo(TRACKER_TYPES.PLANTS).icon;
    const heatIcon = Tracker.getTrackerInfo(TRACKER_TYPES.HEAT).icon;

    const isUndoDisabled = this.history[this.history.length - 1].event === 'newGame';
    const isRedoDisabled = !this.state.undoneHistoryCount;
    const isBuyGreeneryDisabled = this.state.resourceCount[TRACKER_TYPES.PLANTS] < 8;
    const isBuyTemperatureDisabled = this.state.resourceCount[TRACKER_TYPES.HEAT] < 8;

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
                <View style={ styles.sidebarToggleRow }>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onOcean }>
                      <Image style={ styles.toggleOcean } source={ ImageIconOcean } />
                    </TouchableOpacity>
                    <Text style={ styles.toggleBottomText }>{ oceanCount }</Text>
                  </View>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onTemperature }>
                      <Text style={ styles.toggleTopText }>{ temperatureText }</Text>
                      <Image style={ styles.toggleTemperature } source={ ImageIconTemperature } />
                    </TouchableOpacity>
                  </View>
                  <View style={ styles.sidebarToggleColumn }>
                    <TouchableOpacity onPress={ this.onOxygen }>
                      <Image style={ styles.toggleOxygen } source={ ImageIconOxygen } />
                    </TouchableOpacity>
                    <Text style={ styles.toggleBottomText }>{ oxygenLevelText }</Text>
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
                { this.renderTransactionButton('#5FB365', plantsIcon, ImageIconGreenery, 'arrow-right', isBuyGreeneryDisabled, this.onBuyGreenery) }
                { this.renderTransactionButton('#ED4E44', heatIcon, ImageIconTemperature, 'arrow-right', isBuyTemperatureDisabled, this.onBuyTemperature) }
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
    flex: 1
  },

  sidebar: {
    flex: 1,
    paddingVertical: '0.25rem'
  },

  sidebarButtonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  sidebarButtonsLeft: {
    flex: 0.56,
    maxHeight: '10rem'
  },

  sidebarButtonsRight: {
    flex: 0.56,
    maxHeight: '8.5rem'
  },

  sidebarToggleColumn: {
    flex: 1,
    alignItems: 'center'
  },

  sidebarToggleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    marginHorizontal: '0.25rem'
  },

  sidebarTracker: {
    flex: 0.44,
    maxHeight: '10rem'
  },

  toggleOcean: {
    width: '2.35rem',
    height: '2.35rem'
  },

  toggleOxygen: {
    width: '2.35rem',
    height: '2.35rem'
  },

  toggleTemperature: {
    width: '1rem',
    height: '3rem',
    marginTop: '0.5rem',
  },

  toggleTopText: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '-0.75rem',
    marginHorizontal: '-1rem'
  },

  toggleBottomText: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '0.5rem',
    marginHorizontal: '-1rem'
  }

});
