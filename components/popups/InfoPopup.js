import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

export default class InfoPopup extends Component {

  render () {
    return (
      <View style={ styles.container }>
        <Text>Info</Text>
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
