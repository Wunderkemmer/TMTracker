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
    isNegativeZero: true,

    resourceCount: {
      [TRACKER_TYPES.HEAT]: 0,
      [TRACKER_TYPES.STEEL]: 0,
      [TRACKER_TYPES.TITANIUM]: 0
    }
  };

  getResourcesValue () {
    const { state } = this;
    const { resourceCount } = state;

    return state.change > 0 ?
      0 :
      resourceCount[TRACKER_TYPES.HEAT] +
      resourceCount[TRACKER_TYPES.STEEL] * 2 +
      resourceCount[TRACKER_TYPES.TITANIUM] * 3;
  }

  onAdjustResource (type, value) {
    const { state } = this;

    state.resourceCount[type] += value;

    this.setState(state);
  }

  onChange = () => {
    this.props.onChange(this.state.change);
    this.props.dismiss();
  };

  onKeyPad = (value) => {
    const { state } = this;

    if (value === 'C') {
      state.change = 0;
      state.isNegativeZero = false;
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

    this.setState(state);
  };

  renderActionButton = () => {
    const { state } = this;
    const { type, state: parentState } = this.props;

    const resourceCount = parentState.resourceCount[type];
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

    if (!parentResourceCount) {
      return null;
    }

    const resourceCount = state.resourceCount[type];
    const resourceTotal = parentResourceCount - resourceCount;

    const isDownDisabled = resourceCount === 0;
    const isUpDisabled = resourceTotal <= 0;

    const trackerInfo = TRACKER_INFOS[type];
    const icon = trackerInfo.icon;

    return (
      <View style={ styles.resourceAdjuster }>
        { this.renderResourceButton(type, 'angle-up', 1, isUpDisabled) }
        <ImageBackground style={ styles.resourceIcon } resizeMode="contain" source={ icon }>
          <Text style={ styles.resourceText }>{ state.resourceCount[type] }</Text>
        </ImageBackground>
        { this.renderResourceButton(type, 'angle-down', -1, isDownDisabled) }
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

  render () {
    const { state } = this;
    const { type, state: parentState } = this.props;

    const trackerInfo =  TRACKER_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? trackerInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? trackerInfo.color : '#222222' };

    const resourceCount = parentState.resourceCount[type];

    const color = Color(trackerInfo.color);
    const white = Color('#FFFFFF');

    const lighterColor = color.mix(white, 0.65);
    const lighterBackgroundColorStyle = { backgroundColor: color.mix(white, 0.85) };

    const changeText = state.isNegativeZero ?
      '-0' :
      state.change >= 0 ? '+' + state.change : state.change;

    const resourcesText = '+' + this.getResourcesValue();

    return (
      <View style={ styles.container }>
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
          <View style={ styles.tabulatorTab }>
            <View style={ styles.tabulatorRow }>
              { this.renderAdditionalResource(TRACKER_TYPES.HEAT) }
              { this.renderAdditionalResource(TRACKER_TYPES.STEEL) }
              { this.renderAdditionalResource(TRACKER_TYPES.TITANIUM) }
            </View>
            <Text style={ [ styles.changeText, colorStyle ] }>{ resourcesText }</Text>
          </View>
          { this.renderActionButton() }
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  actionButton: {
    borderRadius: '0.5rem',
    marginTop: '-0.025rem',
    marginRight: '-0.025rem',
    marginBottom: '-0.025rem',
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
    marginRight: '0.1rem',
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
    paddingHorizontal: '0.5rem'
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
    alignItems: 'center',
    marginLeft: '0.15rem',
    marginRight: '0.25rem'
  },

  resourceButton: {
    fontSize: '2rem',
    color: '#222222'
  },

  resourceDisabled: {
    opacity: 0.25
  },

  resourceIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.8rem',
    height: '1.8rem'
  },

  resourcesText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  resourceText: {
    fontSize: '1.2rem',
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    paddingHorizontal: '0.5rem'
  },

  tabulatorText: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#444444',
    marginLeft: '0.5rem'
  }

});
