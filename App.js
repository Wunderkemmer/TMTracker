import AsyncStorage from '@react-native-community/async-storage';

import { cloneDeep } from 'lodash';

import React, { Component } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';

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
import ProjectsPopup, { PROJECT_INFOS, PROJECT_TYPES } from './src/components/popups/ProjectsPopup';

import Tracker from './src/components/Tracker';
import TransactionButton from './src/components/TransactionButton';

import { contants } from './src/lib/utils';

import store from './src/store';

import { RESOURCE_TYPES } from './src/store/economy/economyConstants';

import { resetEconomy } from './src/store/economy/economyActions';

const MAX_OCEAN_COUNT = contants.MAX_OCEAN_COUNT;
const MAX_OXYGEN_LEVEL = contants.MAX_OXYGEN_LEVEL;
const MAX_TEMPERATURE = contants.MAX_TEMPERATURE;

const { width } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: width * 0.02
});

Text.defaultProps = Text.defaultProps || {};

Text.defaultProps.allowFontScaling = false;

type Props = {};

export default class App extends Component<Props> {

  isLoading = true;

  history = [];
  undoneHistory = [];

  componentDidMount () {
    AsyncStorage.getItem('gameHistory').then((history) => {
      this.isLoading = false;

      if (history) {
        history = JSON.parse(history);

        if (this.getIsGameInProgress(history)) {
          SplashScreen.hide();

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

      SplashScreen.hide();

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
      (lastState.oceanCount < MAX_OCEAN_COUNT ||
      lastState.oxygenLevel < MAX_OXYGEN_LEVEL ||
      lastState.temperature < MAX_TEMPERATURE);
  }

  restoreGame = (history) => {
    this.history = history;

    const lastState = history[history.length - 1].state;

    this.updateHistoryAndSetState(lastState);
  };

  startGame = () => {
    // const state = cloneDeep(this.defaultState);

    store.dispatch(resetEconomy());

    this.history = [];

    // this.addHistoryAndSetState(state, 'newGame');
  };

  updateHistoryAndSetState (state) {
    state.historyCount = this.history.length;
    state.undoneHistoryCount = this.undoneHistory.length;

    this.setState(state);

    AsyncStorage.setItem('gameHistory', JSON.stringify(this.history));
  }

  onBuyAquifer = () => {
    let { state } = this;

    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_AQUIFER].cost;
    const canPurchase = state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] >= megacreditCost;

    if (canPurchase) {
      const oceanCount = Math.min(state.oceanCount + 1, MAX_OCEAN_COUNT);

      if (state.oceanCount !== oceanCount) {
        state = cloneDeep(state);

        state.oceanCount = oceanCount;
        state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] -= megacreditCost;
        state.resourceCounts[RESOURCE_TYPES.TERRAFORMING_RATING] += 1;

        this.addHistoryAndSetState(state, 'buyAquifer', { oceanCount, cost: megacreditCost });
      }
    }
  };

  onBuyCity = () => {
    let { state } = this;

    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_CITY].cost;
    const canPurchase = state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] >= megacreditCost;

    if (canPurchase) {
      state = cloneDeep(state);

      state.resourceRate[RESOURCE_TYPES.MEGACREDITS] += 1;

      this.addHistoryAndSetState(state, 'buyCity');
    }
  };

  onBuyGreenery = (type) => {
    let { state } = this;

    const plantCost = 8;
    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_GREENERY].cost;

    const canPurchase = type === RESOURCE_TYPES.PLANTS ?
      state.resourceCounts[RESOURCE_TYPES.PLANTS] >= plantCost :
      state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] >= megacreditCost;

    if (canPurchase) {
      state = cloneDeep(state);

      const oxygenLevel = Math.min(state.oxygenLevel + 1, MAX_OXYGEN_LEVEL);

      let wasOxygenAdded = false;

      if (state.oxygenLevel !== oxygenLevel) {
        state.oxygenLevel = oxygenLevel;

        wasOxygenAdded = true;

        state.resourceCounts[RESOURCE_TYPES.TERRAFORMING_RATING] += 1;
      }

      if (type === RESOURCE_TYPES.PLANTS) {
        state.resourceCounts[RESOURCE_TYPES.PLANTS] -= plantCost;
      } else {
        state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] -= megacreditCost;
      }

      this.addHistoryAndSetState(state, 'buyGreenery', { type, wasOxygenAdded });
    }
  };

  onBuyPowerPlant = () => {
    let { state } = this;

    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_POWER_PLANT].cost;
    const canPurchase = state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] >= megacreditCost;

    if (canPurchase) {
      state = cloneDeep(state);

      state.resourceRate[RESOURCE_TYPES.ENERGY] += 1;

      this.addHistoryAndSetState(state, 'buyPowerPlant');
    }
  };

  onBuyTemperature = (type) => {
    let { state } = this;

    const heatCost = 8;
    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_ASTEROID].cost;

    const canPurchase = type === RESOURCE_TYPES.HEAT ?
      state.resourceCounts[RESOURCE_TYPES.HEAT] >= heatCost :
      state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] >= megacreditCost;

    if (canPurchase) {
      const temperature = Math.min(state.temperature + 2, MAX_TEMPERATURE);

      if (state.temperature !== temperature) {
        state = cloneDeep(state);

        state.temperature = temperature;
        state.resourceCounts[RESOURCE_TYPES.TERRAFORMING_RATING] += 1;

        if (type === RESOURCE_TYPES.HEAT) {
          state.resourceCounts[RESOURCE_TYPES.HEAT] -= heatCost;
        } else {
          state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] -= megacreditCost;
        }

        this.addHistoryAndSetState(state, 'buyTemperature', { type });
      }
    }
  };

  // onChange = (type, changes) => {
  //   this.addHistoryAndSetState(state, 'change', { type, changes });
  // };

  // onDecrement = (type) => {
  //   if (didSomething) {
  //     this.addHistoryAndSetState(state, 'decrement', { type });
  //   }
  // };

  onInfo = () => {
    showPopup('info');
  };

  // onIncrement = (type) => {
  //   this.addHistoryAndSetState(state, 'increment', { type });
  // };

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

    const oceanCount = Math.min(state.oceanCount + 1, MAX_OCEAN_COUNT);

    if (state.oceanCount !== oceanCount) {
      state = cloneDeep(state);

      state.oceanCount = oceanCount;

      this.addHistoryAndSetState(state, 'oceanCount');
    }
  };

  onOxygen = () => {
    let { state } = this;

    const oxygenLevel = Math.min(state.oxygenLevel + 1, MAX_OXYGEN_LEVEL);

    if (state.oxygenLevel !== oxygenLevel) {
      state = cloneDeep(state);

      state.oxygenLevel = oxygenLevel;

      this.addHistoryAndSetState(state, 'oxygenLevel');
    }
  };

  onProject = (type) => {
    switch (type) {
      case PROJECT_TYPES.BUY_AQUIFER: this.onBuyAquifer(); break;
      case PROJECT_TYPES.BUY_ASTEROID: this.onBuyTemperature(RESOURCE_TYPES.MEGACREDITS); break;
      case PROJECT_TYPES.BUY_CITY: this.onBuyCity(); break;
      case PROJECT_TYPES.BUY_GREENERY: this.onBuyGreenery(RESOURCE_TYPES.MEGACREDITS); break;
      case PROJECT_TYPES.BUY_POWER_PLANT: this.onBuyPowerPlant(); break;
      case PROJECT_TYPES.SELL_PATENT: this.onSellPatent(); break;
    }
  };

  onProjects = () => {
    const { onProject, state } = this;

    showPopup('projects', { state, onProject });
  };

  onRedo = () => {
    if (this.undoneHistory.length) {
      const historyItem = this.undoneHistory.pop();

      this.history.push(historyItem);

      this.updateHistoryAndSetState(cloneDeep(historyItem.state));
    }
  };

  onSellPatent = () => {
    let { state } = this;

    const megacreditCost = PROJECT_INFOS[PROJECT_TYPES.SELL_PATENT].cost;

    state = cloneDeep(state);

    state.resourceCounts[RESOURCE_TYPES.MEGACREDITS] -= megacreditCost;

    this.addHistoryAndSetState(state, 'sellPatent');
  };

  onTemperature = () => {
    let { state } = this;

    const temperature = Math.min(state.temperature + 2, MAX_TEMPERATURE);

    if (state.temperature !== temperature) {
      state = cloneDeep(state);

      state.temperature = temperature;

      this.addHistoryAndSetState(state, 'temperature');
    }
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
    let style;

    switch (type) {
      case RESOURCE_TYPES.TERRAFORMING_RATING:
      case RESOURCE_TYPES.GENERATION:
        style = styles.trackerTiny;

        break;

      default:
        style = styles.tracker;
    }

    return (
      <Tracker key={ type } style={ style } type={ type } />
    );
  };

  renderTransactionButton = (backgroundColor, cost, image1, image2, icon, isDisabled, onPress) => {
    return (
      <TransactionButton
        style={ styles.button }
        backgroundColor={ backgroundColor }
        cost={ cost }
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

    const { oceanCount, oxygenLevel, resourceCounts, temperature } = store.getState().economy;

    const plantsImage = Tracker.getTrackerInfo(RESOURCE_TYPES.PLANTS).image;
    const heatImage = Tracker.getTrackerInfo(RESOURCE_TYPES.HEAT).image;

    const isUndoDisabled = this.state.historyCount < 2;
    const isRedoDisabled = this.state.undoneHistoryCount < 1;

    const isBuyGreeneryDisabled =
      resourceCounts[RESOURCE_TYPES.PLANTS] < 8;

    const isBuyTemperatureDisabled =
      resourceCounts[RESOURCE_TYPES.HEAT] < 8 || temperature >= MAX_TEMPERATURE;

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
      <Provider store={ store }>
        <Image style={ styles.background } resizeMode="cover" source={ ImageMars } />
        <SafeAreaView style={ styles.safeAreaView }>
          <View style={ styles.container }>
            <View style={ styles.sidebar }>
              <View style={ styles.sidebarTracker }>
                { this.renderTracker(RESOURCE_TYPES.TERRAFORMING_RATING) }
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
                { this.renderTracker(RESOURCE_TYPES.MEGACREDITS) }
                { this.renderTracker(RESOURCE_TYPES.STEEL) }
                { this.renderTracker(RESOURCE_TYPES.TITANIUM) }
              </View>
              <View style={ styles.resourcesRow }>
                { this.renderTracker(RESOURCE_TYPES.PLANTS) }
                { this.renderTracker(RESOURCE_TYPES.ENERGY) }
                { this.renderTracker(RESOURCE_TYPES.HEAT) }
              </View>
            </View>
            <View style={ styles.sidebar }>
              <View style={ styles.sidebarTracker }>
                { this.renderTracker(RESOURCE_TYPES.GENERATION) }
              </View>
              <View style={ styles.sidebarButtonsRight }>
                {
                  this.renderTransactionButton(
                    '#5FB365',
                    8,
                    plantsImage,
                    ImageIconGreenery,
                    'arrow-right',
                    isBuyGreeneryDisabled,
                    () => this.onBuyGreenery(RESOURCE_TYPES.PLANTS)
                  )
                }
                {
                  this.renderTransactionButton(
                    '#ED4E44',
                    8,
                    heatImage,
                    ImageIconTemperature,
                    'arrow-right',
                    isBuyTemperatureDisabled,
                    () => this.onBuyTemperature(RESOURCE_TYPES.HEAT)
                  )
                }
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
              style={ ProjectsPopup.publicStyles.popup }
            />
          </Popups>
        </SafeAreaView>
      </Provider>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  background: {
    backgroundColor: '#000000',
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
