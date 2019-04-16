import React, { Component } from 'react';

import { FlatList, Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

export default class HistoryPopup extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  renderHistoryItem ({ item, index }) {

    switch (item.event) {
      case 'buyGreenery':
        return (
          <View style={ styles.item }>
            <Image style={ styles.icon } resizeMode="contain" source={ ImageIconGreenery } />
            <Text style={ styles.textIncrease }>Purchased Greenery</Text>
          </View>
        );

      case 'buyTemperature':
        return (
          <View style={ styles.item }>
            <Image style={ styles.icon } resizeMode="contain" source={ ImageIconTemperature } />
            <Text style={ styles.textIncrease }>Purchased Temperature</Text>
          </View>
        );

      case 'decrement': {
        const type = item.payload.type;

        const trackerInfo = TRACKER_INFOS[type];

        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return (
              <View style={ styles.item }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textDecrease }>Decreased { title } by 1</Text>
              </View>
            );

          case TRACKER_TYPES.GENERATION:
            return (
              <View style={ styles.item }>
                <Text style={ styles.text }>Returning to { title } { item.state.generation }</Text>
              </View>
            );

          default:
            return (
              <View style={ styles.item }>
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
              <View style={ styles.item }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textIncrease }>Increased { title } by 1</Text>
              </View>
            );

          case TRACKER_TYPES.GENERATION:
            return (
              <View style={ styles.item }>
                <Text style={ styles.text }>Starting { title } { item.state.generation }</Text>
              </View>
            );

          default:
            return (
              <View style={ styles.item }>
                <Image style={ styles.icon } resizeMode="contain" source={ icon } />
                <Text style={ styles.textIncrease }>Increased { title } production by 1</Text>
              </View>
            );
        }
      }

      case 'newGame':
        return (
          <View style={ styles.item }>
            <Text style={ styles.text }>New Game!</Text>
          </View>
        );
    }
  }

  render () {
    const { history = [] } = this.props;

    return (
      <FlatList
        ref={ ref => this.flatList = ref}
        contentContainerStyle={ styles.container }
        data={ history }
        keyExtractor={ this.keyExtractor }
        renderItem={ this.renderHistoryItem }
        onContentSizeChange={
          (width, height) => this.flatList.scrollToOffset({ offset: height, animated: false })
        }
      />
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    alignItems: 'stretch',
    paddingHorizontal: '1rem',
    paddingVertical: '0.8rem'
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

  text: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#333333'
  },

  textDecrease: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#AA2222'
  },

  textIncrease: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#22AA22'
  }

});
