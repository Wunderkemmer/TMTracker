import Color from 'color';

import React, { Component, Fragment } from 'react';

import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeCounts } from '../../store/game/gameActions';
import { RESOURCE_INFOS, RESOURCE_TYPES } from '../../store/game/gameConstants';

import Button from '../Button';

class CalculatorModal extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      width: '75%',
      maxHeight: '24rem'
    }
  });

  static defaultProps = {
    type: RESOURCE_TYPES.MEGACREDITS
  };

  state = {
    change: 0,
    isNegativeZero: !RESOURCE_INFOS[this.props.type].usePositiveCalculator,

    resourceChanges: {
      heat: 0,
      steel: 0,
      titanium: 0
    },

    useResource: {
      heat: false,
      steel: false,
      titanium: false
    }
  };

  capResourceValues () {
    const { state } = this;

    if (state.useResource.heat) {
      while (state.resourceChanges.heat > 0 && this.getResourcesValue() > -state.change) {
        state.resourceChanges.heat--;
      }
    }

    if (state.useResource.steel) {
      while (state.resourceChanges.steel > 0 && this.getResourcesValue() > -state.change) {
        state.resourceChanges.steel--;
      }
    }

    if (state.useResource.titanium) {
      while (state.resourceChanges.titanium > 0 && this.getResourcesValue() > -state.change) {
        state.resourceChanges.titanium--;
      }
    }
  }

  getResourcesValue () {
    const { state } = this;

    return state.change > 0 ?
      0 :
      (state.useResource.heat ? state.resourceChanges.heat : 0) +
      (state.useResource.steel ? state.resourceChanges.steel * 2 : 0) +
      (state.useResource.titanium ? state.resourceChanges.titanium * 3 : 0);
  }

  onAdjustResource (type, value) {
    const { state } = this;

    const newCount = state.resourceChanges[type] + value;
    const resourceInfo = RESOURCE_INFOS[type];
    const total = newCount * resourceInfo.multiplier;

    if (total > -state.change) {
      return;
    }

    state.resourceChanges[type] += value;

    this.setState(state);
  }

  onChange = () => {
    const { state } = this;
    const { hide, type } = this.props;

    const countChanges = {
      [type]: state.change + this.getResourcesValue()
    };

    if (state.useResource.heat) {
      countChanges[RESOURCE_TYPES.HEAT] = -state.resourceChanges.heat;
    }

    if (state.useResource.steel) {
      countChanges[RESOURCE_TYPES.STEEL] = -state.resourceChanges.steel;
    }

    if (state.useResource.titanium) {
      countChanges[RESOURCE_TYPES.TITANIUM] = -state.resourceChanges.titanium;
    }

    this.props.actions.changeCounts(countChanges, 'Calculator Adjustment');

    hide();
  };

  onFastForwardResource = (type) => {
    const { state } = this;
    const { resourceCounts } = this.props;

    // Calculate the max number of resources we can add

    const value = Math.min(
      Math.floor(-(state.change + this.getResourcesValue()) / RESOURCE_INFOS[type].multiplier),
      resourceCounts[type] - state.resourceChanges[type]
    );

    this.onAdjustResource(type, value);
  };

  onKeyPad = (value) => {
    const { state } = this;
    const { type } = this.props;

    if (value === 'C') {
      state.change = 0;
      state.isNegativeZero = !RESOURCE_INFOS[type].usePositiveCalculator;

      state.resourceChanges.heat = 0;
      state.resourceChanges.steel = 0;
      state.resourceChanges.titanium = 0;
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

    this.capResourceValues();
    this.setState(state);
  };

  onToggle = (type) => {
    const { state } = this;

    state.useResource[type] = !state.useResource[type];

    if (type === RESOURCE_TYPES.STEEL) {
      state.useResource.titanium = false;
    } else if (type === RESOURCE_TYPES.TITANIUM) {
      state.useResource.steel = false;
    }

    this.capResourceValues();
    this.setState(state);
  };

  renderActionButton = () => {
    const { state } = this;
    const { type, resourceCounts } = this.props;

    const total = resourceCounts[type] + state.change + this.getResourcesValue();
    const isDisabled = state.change === 0 || total < 0;
    const threshold = RESOURCE_INFOS[type].usePositiveCalculator ? -1 : 0;
    const backgroundColor = state.change <= threshold ? '#ED4E44' : '#5FB365';

    return (
      <Button
        style={ styles.actionButton }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ this.onChange }
      >
        <View style={ styles.actionButtonRow }>
          <Text style={ styles.actionText }>New Total:</Text>
          <Text style={ styles.actionChangeText }>{ total }</Text>
        </View>
      </Button>
    );
  };

  renderAdditionalResource = (type) => {
    const { state } = this;
    const { resourceCounts } = this.props;

    const resourceCount = resourceCounts[type];
    const useResource = state.useResource[type];

    if (!resourceCount || !useResource) {
      return null;
    }

    const resourceChange = state.resourceChanges[type];
    const resourceTotal = resourceCount - resourceChange;

    const { color, image, multiplier } = RESOURCE_INFOS[type];
    const isDownDisabled = resourceChange === 0;

    const isUpDisabled =
      resourceTotal <= 0 ||
      this.getResourcesValue() + multiplier > -state.change;

    const resourceImageStyle = isDownDisabled && isUpDisabled ?
      styles.resourceImageDisabled :
      styles.resourceImage;

    const resourceChangeTextStyle = isDownDisabled && isUpDisabled ?
      styles.resourceChangeTextDisabled :
      styles.resourceChangeText;

    const colorStyle = { color: type ? color : '#222222' };
    const resourcesText = '+' + resourceChange * multiplier;

    return (
      <View style={ styles.tabulatorTab }>
        <View style={ styles.resourceAdjuster }>
          { this.renderResourceButton(type, 'minus', () => this.onAdjustResource(type, -1), isDownDisabled) }
          <ImageBackground style={ resourceImageStyle } resizeMode="contain" source={ image }>
            { this.renderAdditionalResourceCount(type) }
          </ImageBackground>
          { this.renderResourceButton(type, 'plus', () => this.onAdjustResource(type, 1), isUpDisabled) }
          { this.renderResourceButton(type, 'chevron-right', () => this.onFastForwardResource(type), isUpDisabled) }
        </View>
        <Text style={ [ resourceChangeTextStyle, colorStyle ] }>{ resourcesText }</Text>
      </View>
    );
  };

  renderAdditionalResourceCount = (type) => {
    const { state } = this;

    const resourceChange = state.resourceChanges[type];

    if (!resourceChange) {
      return null;
    }

    return (
      <Fragment>
        <View style={ styles.resourceTint } />
        <Text style={ styles.resourceText }>{ resourceChange }</Text>
      </Fragment>
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

  renderResourceButton = (type, icon, onPress, isDisabled) => {
    const { type: calculatorType } = this.props;

    const style = isDisabled ? styles.resourceDisabled : null;
    const colorStyle = { color: RESOURCE_INFOS[calculatorType].color };

    return (
      <TouchableOpacity style={ style } disabled={ isDisabled } onPress={ onPress }>
        <FontAwesome5 style={ [ styles.resourceButton, colorStyle ] } name={ icon } />
      </TouchableOpacity>
    );
  };

  renderResourceToggleButtons = () => {
    const { type } = this.props;

    if (type !== RESOURCE_TYPES.MEGACREDITS) {
      return null;
    }

    const toggleTypes = [ RESOURCE_TYPES.HEAT, RESOURCE_TYPES.STEEL, RESOURCE_TYPES.TITANIUM ];

    return (
      <View style={ styles.toggleButtons }>
        { toggleTypes.map((type) => this.renderToggleButton(type)) }
      </View>
    );
  };

  renderToggleButton = (type) => {
    const { resourceCounts } = this.props;

    if (!resourceCounts[type]) {
      return null;
    }

    const resourceInfo = RESOURCE_INFOS[type];
    const image = resourceInfo.image;

    return (
      <TouchableOpacity
        key={ type }
        style={ styles.toggleButton }
        onPress={ () => this.onToggle(type) }
      >
        <ImageBackground
          style={ styles.toggleButtonResourceImage }
          resizeMode="contain"
          source={ image }
        >
          { this.renderToggleIcon(type) }
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  renderToggleIcon = (type) => {
    const { useResource } = this.state;

    if (!useResource[type]) {
      return null;
    }

    return (
      <Fragment>
        <View style={ styles.resourceTint } />
        <FontAwesome5 style={ styles.toggleButtonIcon } name="chevron-circle-down" solid={ true } />
      </Fragment>
    );
  };

  render () {
    const { change, isNegativeZero } = this.state;
    const { resourceCounts, type } = this.props;

    const resourceCount = resourceCounts[type];
    const resourceInfo = RESOURCE_INFOS[type];
    const backgroundColorStyle = { backgroundColor: type ? resourceInfo.color : '#EEEEEE' };
    const colorStyle = { color: type ? resourceInfo.color : '#222222' };

    const color = Color(resourceInfo.color);
    const white = Color('#FFFFFF');
    const lighterColor = color.mix(white, 0.65);

    const changeText = isNegativeZero ? '-0' : change >= 0 ? '+' + change : change;

    return (
      <View style={ styles.container }>
        { this.renderResourceToggleButtons() }
        <View style={ [ styles.keyPad, backgroundColorStyle ] }>
          <View style={ styles.numPad }>
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
          { this.renderAdditionalResource(RESOURCE_TYPES.HEAT) }
          { this.renderAdditionalResource(RESOURCE_TYPES.STEEL) }
          { this.renderAdditionalResource(RESOURCE_TYPES.TITANIUM) }
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: '0.55rem',
    paddingRight: '0.25rem'
  },

  actionChangeText: {
    alignSelf: 'center',
    fontSize: '3rem',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-0.5rem'
  },

  actionText: {
    flex: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '0.4rem'
  },

  button: {
    margin: '0.2rem'
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
    flex: 1.1,
    flexDirection: 'row',
    borderRadius: '0.5rem',
    padding: '0.5rem'
  },

  keyPadButton: {
    borderRadius: '0.5rem'
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
    paddingRight: '0.5rem',
    paddingLeft: '0.6rem',
    marginBottom: '0.5rem',
    marginLeft: '-0.1rem'
  },

  keyPadTabText: {
    fontSize: '1.2rem',
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
    width: '8rem',
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

  resourceChangeTextDisabled: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '0.35rem',
    marginVertical: '-0.6rem',
    opacity: 0.5
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

  resourceImageDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.2rem',
    height: '2.2rem',
    opacity: 0.5
  },

  resourcesText: {
    fontSize: '3rem',
    color: '#FFFFFF',
    marginRight: '-0.1rem'
  },

  resourceText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 5
  },

  resourceTint: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: '0.1rem'
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
    justifyContent: 'space-between'
  },

  tabulatorTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '0.5rem',
    marginBottom: '0.5rem'
  },

  tabulatorText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#444444',
    marginLeft: '0.5rem'
  },

  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.5rem'
  },

  toggleButtonIcon: {
    fontSize: '1.3rem',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 5
  },

  toggleButtonResourceImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.2rem',
    height: '2.2rem'
  },

  toggleButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: '-2.7rem',
    right: '3.25rem'
  }

});

const mapStateToProps = (state) => {
  const { game } = state;

  return {
    resourceCounts: game.resourceCounts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    changeCounts,
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorModal);