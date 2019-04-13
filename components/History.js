import React, { Component, Fragment } from 'react';

import { SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from './Tracker';

export default class History extends Component {

  renderHistoryItem (item, index) {
    const type = item.payload.type;

    switch (item.event) {
      case 'decrement': {
        const title = TRACKER_INFOS[type].title;

        switch (type) {
          case TRACKER_TYPES.GENERATION:
            return (
              <Text key={ `${ type }.${ index }` } style={ styles.text }>Previous { title }</Text>
            );

          default:
            return (
              <Text key={ `${ type }.${ index }` } style={ styles.text }>-1 { title }</Text>
            );
        }
      }

      case 'increment': {
        const title = TRACKER_INFOS[type].title;

        switch (type) {
          case TRACKER_TYPES.GENERATION:
            return (
              <Text key={ `${ type }.${ index }` } style={ styles.text }>Next { title }</Text>
            );

          default:
            return (
              <Text key={ `${ type }.${ index }` } style={ styles.text }>+1 { title }</Text>
            );
        }
      }
    }
  }

  render () {
    const { isShowingHistory } = this.props;

    if (isShowingHistory) {
      const { dismiss, history } = this.props;

      return (
          <View style={ styles.screen }>
            <TouchableWithoutFeedback onPress={ () => dismiss() }>
              <View style={ styles.scrim } />
            </TouchableWithoutFeedback>
            <SafeAreaView>
              <ScrollView
                style={ styles.scroll }
                contentContainerStyle={ styles.container }
              >
                { history.reverse().map(this.renderHistoryItem) }
              </ScrollView>
            </SafeAreaView>
          </View>
      );
    }

    return null;
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    alignItems: 'stretch',
    padding: '2rem'
  },

  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  scrim: {
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.75
  },

  scroll: {
    backgroundColor: '#FFFFFF',
    borderRadius: '2rem',
    minWidth: '50%',
    margin: '1.3rem'
  },

  text: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    paddingVertical: '0.25rem'
  }

});
