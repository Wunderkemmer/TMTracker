import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

export default class CalculatorPopup extends Component {

  render () {
    const { type } = this.props;

    return (
      <View style={ styles.container }>
        <Text>Calculator { type }</Text>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    alignItems: 'stretch',
    paddingHorizontal: '2rem',
    paddingVertical: '1.75rem'
  }

});
