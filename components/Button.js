import { debounce } from 'lodash';

import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class Button extends Component {

  renderIcon () {
    const { color, icon } = this.props;

    if (icon) {
      const colorStyle = color ? { color } : null;

      return (
        <FontAwesome5 style={ [ styles.icon, colorStyle ] } name={ icon } />
      );
    }

    return null;
  }

  renderText () {
    const { color, text } = this.props;

    if (text) {
      const colorStyle = color ? { color } : null;

      return (
        <Text style={ [ styles.text, colorStyle ] }>{ text }</Text>
      );
    }

    return null;
  }

  render () {
    const { useDebounce = false, backgroundColor, isDisabled, style } = this.props;

    const containerStyle = {};

    if (backgroundColor) {
      containerStyle.backgroundColor = backgroundColor;
    }

    if (style && style.borderRadius) {
      containerStyle.borderRadius = style.borderRadius - 2;
    }

    if (isDisabled) {
      containerStyle.opacity = 0.5;
    }

    let { onPress } = this.props;

    if (useDebounce) {
      onPress = debounce(onPress, 250, { leading: true, trailing: false });
    }

    return (
      <TouchableOpacity
        style={ [ styles.border, style ] }
        disabled={ isDisabled }
        onPress={ onPress }
      >
        <View style={ [ styles.container, containerStyle ] }>
          { this.renderIcon() }
          { this.renderText() }
          { this.props.children }
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  border: {
    backgroundColor: '#222222',
    flex: 1,
    borderRadius: '0.8rem',
    margin: '0.2rem',
    padding: '0.15rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.5
  },

  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderRadius: '0.7rem'
  },

  icon: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#FFFFFF'
  },

  text: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF'
  }

});
