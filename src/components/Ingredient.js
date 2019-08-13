import React, { Component } from 'react';

import { Image, ImageBackground, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import {
  RESOURCE_INFOS,
  RESOURCE_TYPES,
  TERRAFORMING_INFOS
} from '../store/game/gameConstants';

const { abs } = Math;

export default class Ingredient extends Component {

  render () {
    const { info } = this.props;
    const { image, isProduction, type, value } = info;
    const typeInfo = RESOURCE_INFOS[type] || TERRAFORMING_INFOS[type];

    if (typeInfo.hideIngredient) {
      return null;
    }

    const frameStyle = isProduction ? styles.frameProduction : styles.frame;
    const imageStyle = isProduction ? styles.imageProduction : styles.image;
    const absValue = typeInfo.hideValue ? 0 : abs(value);
    const displayValue = absValue > 1 ? absValue : null;

    if (displayValue) {
      return (
        <View style={ frameStyle }>
          <ImageBackground style={ imageStyle } source={ image }>
            <Text style={ styles.value }>{ displayValue }</Text>
          </ImageBackground>
        </View>
      );
    }

    return (
      <View style={ frameStyle }>
        <Image style={ imageStyle } source={ image } />
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.8rem',
    height: '1.8rem'
  },

  imageProduction: {
    width: '1.3rem',
    height: '1.3rem'
  },

  frame: {
    marginHorizontal: '0.2rem'
  },

  frameProduction: {
    backgroundColor: '#B37D43',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#222222',
    borderWidth: 1,
    width: '1.8rem',
    height: '1.8rem',
    marginHorizontal: '0.2rem',
    // padding: '0.2rem'
  },

  value: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 2.5
  }

});
