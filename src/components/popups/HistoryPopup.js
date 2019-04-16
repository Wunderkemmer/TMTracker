import moment from 'moment';

import React, { Component } from 'react';

import { FlatList, Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

export default class HistoryPopup extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  static renderHistoryIconRow (item, icon, text, textStyle) {
    return (
      <View style={ styles.item }>
        <Image style={ styles.icon } resizeMode="contain" source={ icon } />
        <View>
          <Text style={ textStyle }>{ text }</Text>
          <Text style={ styles.textTime }>{ moment(item.time).format('LLL') }</Text>
        </View>
      </View>
    );
  }

  static renderHistoryRow (item, text, textStyle) {
    return (
      <View style={ styles.details }>
        <Text style={ textStyle }>{ text }</Text>
        <Text style={ styles.textTime }>{ moment(item.time).format('LLL') }</Text>
      </View>
    );
  }

  renderHistoryItem ({ item }) {
    switch (item.event) {
      case 'buyGreenery':
        return HistoryPopup.renderHistoryIconRow(
          item, ImageIconGreenery, 'Purchased Greenery', [ styles.text, styles.textIncrease ]
        );

      case 'buyTemperature':
        return HistoryPopup.renderHistoryIconRow(
          item, ImageIconTemperature, 'Purchased Temperature', [ styles.text, styles.textIncrease ]
        );

      case 'decrement': {
        const type = item.payload.type;

        const trackerInfo = TRACKER_INFOS[type];
        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return HistoryPopup.renderHistoryIconRow(
              item, icon, `Decreased ${ title } by 1`, [ styles.text, styles.textDecrease ]
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              item, `Returning to ${ title } ${ item.state.generation }`, styles.text
            );

          default:
            return HistoryPopup.renderHistoryIconRow(
              item, icon, `Decreased ${ title } production by 1`, [ styles.text, styles.textDecrease ]
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
            return HistoryPopup.renderHistoryIconRow(
              item, icon, `Increased ${ title } by 1`, [ styles.text, styles.textIncrease ]
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              item, `Starting ${ title } ${ item.state.generation }`, styles.text
            );

          default:
            return HistoryPopup.renderHistoryIconRow(
              item, icon, `Increased ${ title } production by 1`, [ styles.text, styles.textIncrease ]
            );
        }
      }

      case 'newGame':
        return HistoryPopup.renderHistoryRow(
          item, 'New Game!', styles.text
        );
    }
  }

  render () {
    const { history = [] } = this.props;

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ history.reverse() }
        keyExtractor={ this.keyExtractor }
        renderItem={ this.renderHistoryItem }
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

  details: {
    paddingVertical: '0.3rem'
  },

  icon: {
    width: '2.2rem',
    height: '2.2rem',
    marginRight: '0.5rem'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: '0.3rem'
  },

  text: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginTop: '-0.2rem'
  },

  textDecrease: {
    color: '#AA2222'
  },

  textIncrease: {
    color: '#22AA22'
  },

  textTime: {
    fontSize: '0.8rem',
    color: '#222222'
  }

});
