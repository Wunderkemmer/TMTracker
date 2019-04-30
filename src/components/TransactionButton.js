import React, { Component } from 'react';

import { Image, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from './Button';

export default class TransactionButton extends Component {

  render () {
    const { backgroundColor, icon, image1, image2, isDisabled, onPress, style } = this.props;

    return (
      <Button
        style={ style }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ onPress }
        useDebounce={ true }
      >
        <View style={ styles.row }>
          <Image style={ styles.image } source={ image1 } />
          <FontAwesome5 style={ styles.icon } name={ icon } />
          <Image style={ styles.image } source={ image2 } />
        </View>
      </Button>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  icon: {
    fontSize: '1.4rem',
    color: '#FFFFFF'
  },

  image: {
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
