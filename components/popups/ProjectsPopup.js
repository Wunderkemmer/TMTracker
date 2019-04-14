import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

export default class ProjectsPopup extends Component {

  render () {
    return (
      <View style={ styles.container }>
        <Text>Projects</Text>
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
