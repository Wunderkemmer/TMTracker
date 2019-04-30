import React, { Component } from 'react';

import { Image, ImageBackground, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from './Button';

export default class ProjectButton extends Component {

  renderImage (image, isProduction) {
    if (!image) {
      return null;
    }

    const frameStyle = isProduction ? styles.production : styles.resource;
    const imageStyle = isProduction ? styles.imageProduction : styles.image;

    return (
      <View style={ frameStyle }>
        <Image style={ imageStyle } source={ image } />
      </View>
    );
  }

  renderCost (image, cost) {
    if (cost <= 0) {
      return (
        <View style={ styles.resource }>
          <Image style={ styles.image } source={ image } />
        </View>
      );
    }

    return (
      <View style={ styles.resource }>
        <ImageBackground style={ styles.image } source={ image }>
          <Text style={ styles.cost }>{ cost }</Text>
        </ImageBackground>
      </View>
    );
  }

  render () {
    const {
      backgroundColor,
      cost,
      icon,
      image1,
      image2,
      image2IsProduction,
      image3,
      image3IsProduction,
      isDisabled,
      onPress,
      style,
      text,
      textStyle
    } = this.props;

    return (
      <Button
        style={ style }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ onPress }
        useDebounce={ true }
      >
        <Text style={ [ styles.text, textStyle ] }>{ text }</Text>
        <View style={ styles.row }>
          { this.renderCost(image1, cost) }
          <FontAwesome5 style={ styles.icon } name={ icon } />
          { this.renderImage(image2, image2IsProduction) }
          { this.renderImage(image3, image3IsProduction) }
        </View>
      </Button>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  cost: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 2.5
  },

  icon: {
    fontSize: '1.4rem',
    color: '#FFFFFF',
    marginHorizontal: '0.3rem'
  },

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

  production: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginHorizontal: '0.2rem',
    padding: '0.2rem'
  },

  resource: {
    marginHorizontal: '0.2rem'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0.4rem',
    marginBottom: '0.1rem',
    paddingHorizontal: '0.4rem'
  },

  text: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF'
  }

});
