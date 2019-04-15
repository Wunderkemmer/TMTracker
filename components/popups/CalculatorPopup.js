import Color from 'color';

import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import Button from '../Button';
import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

export default class CalculatorPopup extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      width: '75%',
      maxHeight: '25rem'
    },
  });

  state = {
    change: 0
  };

  onChange = () => {
    this.props.onChange(this.state.change);
    this.props.dismiss();
  };

  onKeyPad = (value) => {
    const { state: parentState } = this.props;
    const { state } = this;

    if (value === 'C') {
      state.change = 0;
    } else if (typeof value === 'string') {
      state.change = Number.parseInt(state.change + value);
    } else {
      state.change = state.change + value;
    }

    state.change = Math.min(Math.max(state.change, 0), 999);

    this.setState(state);
  };

  renderKeyPadButton = (value, backgroundColor, isDisabled) => {
    const text = typeof value !== 'string' && value > 0 ? '+' + value : value;

    return (
      <Button
        backgroundColor={ backgroundColor }
        color="#222222"
        text={ text }
        textStyle={ styles.keyPadText }
        isDisabled={ isDisabled }
        onPress={ () => this.onKeyPad(value) }
      />
    );
  };

  render () {
    const { type, state: parentState } = this.props;
    const { state } = this;

    const trackerInfo =  TRACKER_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? trackerInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? trackerInfo.color : '#222222' };

    const resourceCount = parentState.resourceCount[type];

    const isCreditDisabled = state.change === 0;
    const isDeductDisabled = state.change === 0 || resourceCount - state.change < 0;

    const creditedTotal = resourceCount + state.change;
    const deductedTotal = Math.max(resourceCount - state.change, 0);

    const lighterColor = Color(trackerInfo.color).mix(Color('#FFFFFF'), 0.65);

    return (
      <View style={ styles.container }>
        <View style={ [ styles.keyPad, backgroundColorStyle ] }>
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
            { this.renderKeyPadButton('0', '#FFFFFF') }
            { this.renderKeyPadButton('C', lighterColor) }
          </View>
          <View style={ styles.keyPadRow }>
            { this.renderKeyPadButton(-10, lighterColor, state.change < 10) }
            { this.renderKeyPadButton(-5, lighterColor, state.change < 5) }
            { this.renderKeyPadButton(-1, lighterColor, state.change < 1) }
            { this.renderKeyPadButton(1, lighterColor) }
            { this.renderKeyPadButton(5, lighterColor) }
            { this.renderKeyPadButton(10, lighterColor) }
          </View>
        </View>
        <View style={ styles.tabulator }>
          <Text style={ styles.infoText }>{ `Current ${ trackerInfo.title }` }</Text>
          <Text style={ [ styles.currentText, colorStyle ] }>
            { resourceCount }
          </Text>
          <View style={ [ styles.keyPadTab, backgroundColorStyle ] }>
            <Text style={ styles.infoTextTab }>{ `Change in ${ trackerInfo.title }` }</Text>
            <Text style={ styles.changeText }>{ state.change }</Text>
          </View>
          <View style={ styles.actionButtons }>
            <Button
              backgroundColor="#ED4E44"
              isDisabled={ isDeductDisabled }
              onPress={ () => this.onChange() }
            >
              <View style={ styles.actionRow }>
                <View>
                  <Text style={ styles.actionNameText }>Deduct</Text>
                  <Text style={ styles.actionNewText }>New Total:</Text>
                </View>
                <Text style={ styles.actionChangeText }>{ deductedTotal }</Text>
              </View>
            </Button>
            <Button
              backgroundColor="#5FB365"
              isDisabled={ isCreditDisabled }
              onPress={ () => this.onChange() }
            >
              <View style={ styles.actionRow }>
                <View>
                  <Text style={ styles.actionNameText }>Credit</Text>
                  <Text style={ styles.actionNewText }>New Total:</Text>
                </View>
                <Text style={ styles.actionChangeText }>{ creditedTotal }</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  actionButtons: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    marginTop: '0.25rem',
    marginRight: '-0.2rem',
    marginBottom: '-0.2rem',
    marginLeft: '0.3rem'
  },

  actionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '0.5rem',
    paddingRight: '0.25rem'
  },

  actionChangeText: {
    fontSize: '2.8rem',
    color: '#FFFFFF',
    marginVertical: '-0.5rem'
  },

  actionNameText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  actionNewText: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  changeText: {
    fontSize: '2.8rem',
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
    fontSize: '2.8rem',
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
    flex: 2,
    borderRadius: '0.5rem',
    padding: '0.5rem'
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
    width: '100%',
    paddingRight: '0.5rem'
  },

  keyPadText: {
    fontSize: '1.5rem'
  },

  tabulator: {
    flex: 1,
    alignItems: 'flex-end'
  }

});
