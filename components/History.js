import React, { Component } from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from './Tracker';

export default class History extends Component {

  renderHistoryItem (item, index) {

    switch (item.event) {
      case 'decrement': {
        const type = item.payload.type;

        const trackerInfo = TRACKER_INFOS[type];

        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textDecrease }>Decreased { title } by 1</Text>
              </View>
            );

          case TRACKER_TYPES.GENERATION:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Text style={ styles.text }>Returning to { title } { item.state.generation }</Text>
              </View>
            );

          default:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textDecrease }>Decreased { title } production by 1</Text>
              </View>
            );
        }
      }

      case 'increment': {
        const type = item.payload.type;

        const trackerInfo = TRACKER_INFOS[type];

        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textIncrease }>Increased { title } by 1</Text>
              </View>
            );

          case TRACKER_TYPES.GENERATION:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Text style={ styles.text }>Starting { title } { item.state.generation }</Text>
              </View>
            );

          default:
            return (
              <View style={ styles.item } key={ `${ item.event }.${ index }` }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textIncrease }>Increased { title } production by 1</Text>
              </View>
            );
        }
      }

      case 'newGame': {
        return (
          <View style={ styles.item } key={ `${ item.event }.${ index }` }>
            <Text style={ styles.text }>New Game!</Text>
          </View>
        );
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
              { [ ...history ].reverse().map(this.renderHistoryItem) }
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
    paddingHorizontal: '2rem',
    paddingVertical: '1.75rem'
  },

  icon: {
    width: '1.6rem',
    height: '1.8rem',
    marginRight: '0.5rem'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: '0.2rem'
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
    opacity: 0.5
  },

  scroll: {
    backgroundColor: '#FFFFFF',
    borderRadius: '2rem',
    minWidth: '50%',
    marginVertical: '1.3rem'
  },

  text: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333333'
  },

  textDecrease: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#AA2222'
  },

  textIncrease: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#22AA22'
  }

});
