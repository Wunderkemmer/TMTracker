import Color from 'color';

import React, { Component } from 'react';

import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Button from '../Button';
import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

export default class CalculatorPopup extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      width: '75%',
      maxHeight: '22rem'
    },
  });

  state = {
    change: 0,
    isNegativeZero: !TRACKER_INFOS[this.props.type].usePositiveCalculator,

    resourceCount: {
      [TRACKER_TYPES.HEAT]: 0,
      [TRACKER_TYPES.STEEL]: 0,
      [TRACKER_TYPES.TITANIUM]: 0
    },

    useResource: {
      [TRACKER_TYPES.HEAT]: false,
      [TRACKER_TYPES.STEEL]: false,
      [TRACKER_TYPES.TITANIUM]: false,
    }
  };

  capResourceValues (state) {
    if (state.useResource[TRACKER_TYPES.HEAT]) {
      while (state.resourceCount[TRACKER_TYPES.HEAT] > 0 && this.getResourcesValue() > -state.change) {
        state.resourceCount[TRACKER_TYPES.HEAT]--;
      }
    }

    if (state.useResource[TRACKER_TYPES.STEEL]) {
      while (state.resourceCount[TRACKER_TYPES.STEEL] > 0 && this.getResourcesValue() > -state.change) {
        state.resourceCount[TRACKER_TYPES.STEEL]--;
      }
    }

    if (state.useResource[TRACKER_TYPES.TITANIUM]) {
      while (state.resourceCount[TRACKER_TYPES.TITANIUM] > 0 && this.getResourcesValue() > -state.change) {
        state.resourceCount[TRACKER_TYPES.TITANIUM]--;
      }
    }
  }

  getResourcesValue () {
    const { state } = this;
    const { resourceCount } = state;

    return state.change > 0 ?
      0 :
      (state.useResource[TRACKER_TYPES.HEAT] ? resourceCount[TRACKER_TYPES.HEAT] : 0) +
      (state.useResource[TRACKER_TYPES.STEEL] ? resourceCount[TRACKER_TYPES.STEEL] * 2 : 0) +
      (state.useResource[TRACKER_TYPES.TITANIUM] ? resourceCount[TRACKER_TYPES.TITANIUM] * 3 : 0);
  }

  onAdjustResource (type, value) {
    const { state } = this;

    const newCount = state.resourceCount[type] + value;
    const trackerInfo = TRACKER_INFOS[type];

    const total = newCount * trackerInfo.multiplier;

    if (total > -state.change) {
      return;
    }

    state.resourceCount[type] += value;

    this.setState(state);
  }

  onChange = () => {
    const { state } = this;
    const { type } = this.props;

    const change = {
      [type]: state.change + this.getResourcesValue()
    };

    if (state.useResource[TRACKER_TYPES.HEAT]) {
      change[TRACKER_TYPES.HEAT] = -state.resourceCount[TRACKER_TYPES.HEAT];
    }

    if (state.useResource[TRACKER_TYPES.STEEL]) {
      change[TRACKER_TYPES.STEEL] = -state.resourceCount[TRACKER_TYPES.STEEL];
    }

    if (state.useResource[TRACKER_TYPES.TITANIUM]) {
      change[TRACKER_TYPES.TITANIUM] = -state.resourceCount[TRACKER_TYPES.TITANIUM];
    }

    this.props.onChange(change);
    this.props.dismiss();
  };

  onKeyPad = (value) => {
    const { state } = this;
    const { type } = this.props;

    if (value === 'C') {
      state.change = 0;
      state.isNegativeZero = !TRACKER_INFOS[type].usePositiveCalculator;

      state.resourceCount[TRACKER_TYPES.HEAT] = 0;
      state.resourceCount[TRACKER_TYPES.STEEL] = 0;
      state.resourceCount[TRACKER_TYPES.TITANIUM] = 0;
    } else if (value === '±') {
      if (state.change === 0) {
        state.isNegativeZero = !state.isNegativeZero;
      } else {
        state.change = state.change * -1;
      }
    } else if (typeof value === 'string') {
      if (state.isNegativeZero) {
        state.change = -value;
      } else {
        state.change = Number.parseInt(state.change + value);
      }
    } else {
      state.change = state.change + value;
    }

    state.change = Math.min(Math.max(state.change, -999), 999);

    if (state.change !== 0) {
      state.isNegativeZero = false;
    }

    this.capResourceValues(state);
    this.setState(state);
  };

  onToggle = (type) => {
    const { state } = this;

    state.useResource[type] = !state.useResource[type];

    if (type === TRACKER_TYPES.STEEL) {
      state.useResource[TRACKER_TYPES.TITANIUM] = false;
    } else if (type === TRACKER_TYPES.TITANIUM) {
      state.useResource[TRACKER_TYPES.STEEL] = false;
    }

    this.capResourceValues(state);
    this.setState(state);
  };

  renderActionButton = () => {
    const { state } = this;
    const { type, state: parentState } = this.props;

    const resourceCount = type === TRACKER_TYPES.TERRAFORMING_RATING ?
      parentState.terraformingRating :
      parentState.resourceCount[type];

    const resourceTotal = resourceCount + state.change + this.getResourcesValue();

    const isDisabled = state.change === 0 || resourceTotal < 0;
    const backgroundColor = state.change <= 0 ? '#ED4E44' : '#5FB365';
    const name = state.change <= 0 ? 'Deduct' : 'Credit';

    return (
      <Button
        style={ styles.actionButton }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ this.onChange }
      >
        <View style={ styles.actionButtonRow }>
          <View>
            <Text style={ styles.actionNameText }>{ name }</Text>
            <Text style={ styles.actionNewText }>New Total:</Text>
          </View>
          <Text style={ styles.actionChangeText }>{ Math.max(resourceTotal, 0) }</Text>
        </View>
      </Button>
    );
  };

  renderKeyPadButton = (value, backgroundColor, isSmall) => {
    if (value === '±') {
      return (
        <Button
          style={ styles.button }
          backgroundColor={ backgroundColor }
          color="#222222"
          onPress={ () => this.onKeyPad(value) }
        >
          <View style={ styles.keyPadPlusMinus }>
            <Text style={ styles.keyPadPlusMinusText }>+</Text>
            <Text style={ styles.keyPadPlusMinusText }>-</Text>
          </View>
        </Button>
      );
    } else {
      const textStyle = isSmall ? styles.keyPadTextSmall : styles.keyPadTextLarge;

      const text = typeof value === 'string' ?
        value :
        value >= 0 ? '+' + value : value;

      return (
        <Button
          style={ styles.button }
          backgroundColor={ backgroundColor }
          color="#222222"
          text={ text }
          textStyle={ textStyle }
          onPress={ () => this.onKeyPad(value) }
        />
      );
    }
  };

  renderAdditionalResource = (type) => {
    const { state } = this;
    const { state: parentState } = this.props;

    const parentResourceCount = parentState.resourceCount[type];
    const useResource = state.useResource[type];

    if (!parentResourceCount || !useResource) {
      return null;
    }

    const resourceCount = state.resourceCount[type];
    const resourceTotal = parentResourceCount - resourceCount;

    const trackerInfo = TRACKER_INFOS[type];
    const isDownDisabled = resourceCount === 0;

    const isUpDisabled =
      resourceTotal <= 0 ||
      this.getResourcesValue() + trackerInfo.multiplier > -state.change;

    const image = trackerInfo.image;
    const colorStyle = { color: type ? trackerInfo.color : '#222222' };
    const resourcesText = '+' + resourceCount * trackerInfo.multiplier;

    return (
      <View style={ styles.tabulatorTab }>
        <View style={ styles.resourceAdjuster }>
          { this.renderResourceButton(type, 'minus', -1, isDownDisabled) }
          <ImageBackground style={ styles.resourceImage } resizeMode="contain" source={ image }>
            <Text style={ styles.resourceText }>{ state.resourceCount[type] }</Text>
          </ImageBackground>
          { this.renderResourceButton(type, 'plus', 1, isUpDisabled) }
        </View>
        <Text style={ [ styles.resourceChangeText, colorStyle ] }>{ resourcesText }</Text>
      </View>
    );
  };

  renderResourceButton = (type, icon, value, isDisabled) => {
    const { type: calculatorType } = this.props;

    const style = isDisabled ? styles.resourceDisabled : null;
    const colorStyle = { color: TRACKER_INFOS[calculatorType].color };

    return (
      <TouchableOpacity
        style={ style }
        disabled={ isDisabled }
        onPress={ () => this.onAdjustResource(type, value) }
      >
        <FontAwesome5 style={ [ styles.resourceButton, colorStyle ] } name={ icon } />
      </TouchableOpacity>
    );
  };

  renderResourceToggleButtons = () => {
    const { type } = this.props;

    if (type !== TRACKER_TYPES.MEGACREDITS) {
      return null;
    }

    const toggleTypes = [ TRACKER_TYPES.HEAT, TRACKER_TYPES.STEEL, TRACKER_TYPES.TITANIUM ];

    return (
      <View style={ styles.toggleButtons }>
        { toggleTypes.map((type) => this.renderToggleButton(type)) }
      </View>
    );
  };

  renderToggleButton = (type) => {
    const { state: parentState } = this.props;

    const parentResourceCount = parentState.resourceCount[type];

    if (!parentResourceCount) {
      return null;
    }

    const trackerInfo = TRACKER_INFOS[type];
    const image = trackerInfo.image;

    return (
      <TouchableOpacity
        key={ type }
        style={ styles.toggleButton }
        onPress={ () => this.onToggle(type) }
      >
        <ImageBackground style={ styles.toggleButtonResourceImage } resizeMode="contain" source={ image }>
          { this.renderToggleIcon(type) }
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  renderToggleIcon = (type) => {
    const useResource = this.state.useResource[type];
    const icon = useResource ? 'arrow-alt-circle-down' : 'times';

    return (
      <FontAwesome5 style={ styles.toggleButtonIcon } name={ icon } solid={ true } />
    );
  };

  render () {
    const { state } = this;
    const { type, state: parentState } = this.props;

    const trackerInfo =  TRACKER_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? trackerInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? trackerInfo.color : '#222222' };

    const resourceCount = type === TRACKER_TYPES.TERRAFORMING_RATING ?
      parentState.terraformingRating :
      parentState.resourceCount[type];

    const color = Color(trackerInfo.color);
    const white = Color('#FFFFFF');

    const lighterColor = color.mix(white, 0.65);

    const changeText = state.isNegativeZero ?
      '-0' :
      state.change >= 0 ? '+' + state.change : state.change;

    return (
      <View style={ styles.container }>
        { this.renderResourceToggleButtons() }
        <View style={ [ styles.keyPad, backgroundColorStyle ] }>
          <View style={ styles.numPad}>
            <View style={ styles.keyPadRow }>
              { this.renderKeyPadButton('7', '#FFFFFF') }
              { this.renderKeyPadButton('8', '#FFFFFF') }
              { this.renderKeyPadButton('9', '#FFFFFF') }
            </View>
            <View style={ styles.keyPadRow }>
              { this.renderKeyPadButton('4', '#FFFFFF') }
              { this.renderKeyPadButton('5', '#FFFFFF') }
              { this.renderKeyPadButton('6', '#FFFFFF') }
            </View>
            <View style={ styles.keyPadRow }>
              { this.renderKeyPadButton('1', '#FFFFFF') }
              { this.renderKeyPadButton('2', '#FFFFFF') }
              { this.renderKeyPadButton('3', '#FFFFFF') }
            </View>
            <View style={ styles.keyPadRow }>
              { this.renderKeyPadButton('C', lighterColor) }
              { this.renderKeyPadButton('0', '#FFFFFF') }
              { this.renderKeyPadButton('±', lighterColor) }
            </View>
          </View>
          <View style={ styles.steppers }>
            { this.renderKeyPadButton(5, lighterColor, true) }
            { this.renderKeyPadButton(1, lighterColor, true) }
            { this.renderKeyPadButton(-1, lighterColor, true) }
            { this.renderKeyPadButton(-5, lighterColor, true) }
          </View>
        </View>
        <View style={ styles.tabulator }>
          <View style={ styles.tabulatorRow }>
            <Text style={ [ styles.tabulatorText, colorStyle ] }>{ `Current:` }</Text>
            <Text style={ [ styles.currentText, colorStyle ] }>
              { resourceCount }
            </Text>
          </View>
          <View style={ [ styles.keyPadTab, backgroundColorStyle ] }>
            <Text style={ styles.keyPadTabText }>{ `Change:` }</Text>
            <Text style={ styles.changeText }>{ changeText }</Text>
          </View>
          { this.renderAdditionalResource(TRACKER_TYPES.HEAT) }
          { this.renderAdditionalResource(TRACKER_TYPES.STEEL) }
          { this.renderAdditionalResource(TRACKER_TYPES.TITANIUM) }
          { this.renderActionButton() }
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  actionButton: {
    borderRadius: '0.5rem',
    marginLeft: '0.5rem'
  },

  actionButtonRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '0.5rem',
    paddingRight: '0.25rem'
  },

  actionChangeText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    // marginRight: '-0.1rem',
    marginVertical: '-0.5rem'
  },

  actionNameText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: '-0.1rem'
  },

  actionNewText: {
    fontSize: '1rem',
    color: '#FFFFFF'
  },

  button: {
    margin: '0.2rem',
  },

  changeText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '0.5rem'
  },

  currentText: {
    fontSize: '3rem',
    textAlign: 'right',
    color: '#FFCC33',
    marginTop: '-0.5rem',
    marginRight: '0.35rem'
  },

  keyPad: {
    flex: 1.25,
    flexDirection: 'row',
    borderRadius: '0.5rem',
    padding: '0.5rem'
  },

  keyPadButton: {
    borderRadius: '0.5rem',
  },

  keyPadRow: {
    flex: 1,
    flexDirection: 'row'
  },

  keyPadTab: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    paddingHorizontal: '0.5rem',
    marginBottom: '0.5rem'
  },

  keyPadTabText: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '0.5rem',
    marginBottom: '-0.2rem'
  },

  keyPadPlusMinus: {
    marginTop: '0.1rem'
  },

  keyPadPlusMinusText: {
    fontSize: '2.2rem',
    textAlign: 'center',
    marginVertical: '-0.65rem'
  },

  keyPadTextLarge: {
    fontSize: '1.9rem'
  },

  keyPadTextSmall: {
    fontSize: '1.7rem'
  },

  numPad: {
    flex: 3
  },

  resourceAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '45%',
    marginLeft: '0.15rem',
    marginRight: '0.25rem'
  },

  resourceButton: {
    fontSize: '1.8rem',
    color: '#222222'
  },

  resourceChangeText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '0.35rem',
    marginVertical: '-0.6rem'
  },

  resourceDisabled: {
    opacity: 0.25
  },

  resourceImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.2rem',
    height: '2.2rem'
  },

  resourcesText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  resourceText: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 4
  },

  steppers: {
    flex: 1,
    marginLeft: '0.5rem'
  },

  tabulator: {
    flex: 1,
    alignItems: 'stretch'
  },

  tabulatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tabulatorTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '0.5rem',
    marginBottom: '0.5rem'
  },

  tabulatorText: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#444444',
    marginLeft: '0.5rem'
  },

  toggleButton: {
    backgroundColor: 'red',

    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.5rem'
  },

  toggleButtonIcon: {
    fontSize: '1.3rem',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 4
  },

  toggleButtonResourceImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.1rem',
    height: '2.1rem',
  },

  toggleButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: '-2.5rem',
    right: '3rem'
  }

});
