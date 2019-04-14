import React, { Component } from 'react';

import { Image, ScrollView, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

export default class HistoryPopup extends Component {

  renderHistoryItem (item, index) {

    switch (item.event) {
      case 'buyGreenery': {
        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.PLANTS];
        const icon = trackerInfo.icon;

        return (
          <View style={ styles.item } key={ `${ item.event }.${ index }` }>
            <Image style={ styles.icon } resizeMode="contain" source={ icon } />
            <Text style={ styles.text }>Purchased Greenery</Text>
          </View>
        );
      }

      case 'buyTemperature': {
        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.HEAT];
        const icon = trackerInfo.icon;

        return (
          <View style={ styles.item } key={ `${ item.event }.${ index }` }>
            <Image style={ styles.icon } resizeMode="contain" source={ icon } />
            <Text style={ styles.text }>Purchased Temperature</Text>
          </View>
        );
      }

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

      case 'newGame':
        return (
          <View style={ styles.item } key={ `${ item.event }.${ index }` }>
            <Text style={ styles.text }>New Game!</Text>
          </View>
        );
    }
  }

  render () {
    const { history = [] } = this.props;

    return (
      <ScrollView
        style={ styles.scroll }
        contentContainerStyle={ styles.container }
      >
        { [ ...history ].reverse().map(this.renderHistoryItem) }
      </ScrollView>
    );
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

  scroll: {
    backgroundColor: '#FFFFFF',
    borderRadius: '2rem',
    minWidth: '50%'
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
