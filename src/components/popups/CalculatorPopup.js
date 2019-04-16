import Color from 'color';

import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import Button from '../Button';
import { TRACKER_INFOS } from '../Tracker';

export default class CalculatorPopup extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      width: '75%',
      maxHeight: '22rem'
    },
  });

  state = {
    change: 0,
    isNegative: false
  };

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
    const { type, state: parentState } = this.props;
    const { state } = this;

    const resourceCount = parentState.resourceCount[type];
    const resourceTotal = resourceCount + state.change;

    const isDisabled = state.change === 0 || resourceTotal < 0;
    const backgroundColor = state.change < 0 ? '#ED4E44' : '#5FB365';
    const name = state.change < 0 ? 'Deduct' : 'Credit';

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

  render () {
    const { type, state: parentState } = this.props;
    const { state } = this;

    const trackerInfo =  TRACKER_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? trackerInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? trackerInfo.color : '#222222' };

    const resourceCount = parentState.resourceCount[type];

    const lighterColor = Color(trackerInfo.color).mix(Color('#FFFFFF'), 0.65);

    const changeText = state.isNegativeZero ?
      '-0' :
      state.change >= 0 ? '+' + state.change : state.change;

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
            { this.renderKeyPadButton(10, lighterColor, true) }
            { this.renderKeyPadButton(5, lighterColor, true) }
            { this.renderKeyPadButton(1, lighterColor, true) }
            { this.renderKeyPadButton(-1, lighterColor, true) }
            { this.renderKeyPadButton(-5, lighterColor, true) }
            { this.renderKeyPadButton(-10, lighterColor, true) }
          </View>
        </View>
        <View style={ styles.tabulator }>
          <Text style={ styles.infoText }>{ `Current ${ trackerInfo.title }` }</Text>
          <Text style={ [ styles.currentText, colorStyle ] }>
            { resourceCount }
          </Text>
          <View style={ [ styles.keyPadTab, backgroundColorStyle ] }>
            <Text style={ styles.infoTextTab }>{ `Change in ${ trackerInfo.title }` }</Text>
            <Text style={ styles.changeText }>{ changeText }</Text>
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
    marginTop: '0.5rem',
    marginRight: '-0.025rem',
    marginBottom: '-0.025rem'
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
    color: '#FFFFFF'
  },

  actionNewText: {
    fontSize: '1rem',
    fontWeight: 'bold',
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
    marginTop: '-0.25rem',
    marginRight: '0.35rem'
  },

  infoText: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#444444',
    marginRight: '0.5rem'
  },

  infoTextTab: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#FFFFFF',
    marginTop: '0.5rem',
    marginBottom: '-0.2rem'
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
    alignItems: 'flex-end',
    fontSize: '1.5rem',
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    marginLeft: '-0.3rem',
    paddingRight: '0.5rem'
  },

  keyPadTextLarge: {
    fontSize: '1.9rem'
  },

  keyPadPlusMinus: {
    marginTop: '0.1rem'
  },

  keyPadPlusMinusText: {
    fontSize: '2.2rem',
    textAlign: 'center',
    marginVertical: '-0.65rem'
  },

  keyPadTextSmall: {
    fontSize: '1.25rem'
  },

  numPad: {
    flex: 3
  },

  steppers: {
    flex: 1,
    marginLeft: '0.25rem'
  },

  tabulator: {
    flex: 1,
    alignItems: 'stretch',
    paddingLeft: '0.25rem'
  }

});
