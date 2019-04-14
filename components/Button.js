import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

export default class Button extends Component {

  render () {
    const { color, onPress, style, text } = this.props;

    const backgroundColorStyle = color ? { backgroundColor: color } : null;

    return (
      <TouchableOpacity style={ [ styles.border, style ] } onPress={ onPress }>
        <View style={ [ styles.container, backgroundColorStyle ] }>
          <Text style={ styles.text }>{ text }</Text>
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
      height: 2.5
    },
    shadowRadius: 2,
    shadowOpacity: 0.25
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.7rem'
  },

  text: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  }

});
