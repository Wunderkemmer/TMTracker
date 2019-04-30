import React, { Component } from 'react';

import { Image, ImageBackground, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from './Button';

export default class TransactionButton extends Component {

  render () {
    const { backgroundColor, cost, icon, image1, image2, isDisabled, onPress, style } = this.props;

    return (
      <Button
        style={ style }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ onPress }
        useDebounce={ true }
      >
        <View style={ styles.row }>
          <ImageBackground style={ styles.image } source={ image1 }>
            <Text style={ styles.cost }>{ cost }</Text>
          </ImageBackground>
          <FontAwesome5 style={ styles.icon } name={ icon } />
          <Image style={ styles.image } source={ image2 } />
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
    color: '#FFFFFF'
  },

  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.6rem',
    height: '1.6rem'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.4rem'
  }

});
