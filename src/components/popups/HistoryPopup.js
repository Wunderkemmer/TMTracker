import moment from 'moment';

import React, { Component } from 'react';

import { FlatList, Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

export default class HistoryPopup extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  static renderHistoryIconRow (item, icon, text, textStyle, isProduction) {
    const frameStyle = isProduction ? styles.production : styles.resource;
    const iconStyle = isProduction ? styles.iconProduction : styles.iconResource;

    return (
      <View style={ styles.item }>
        <View style={ frameStyle }>
          <Image style={ iconStyle } resizeMode="contain" source={ icon } />
        </View>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          <Text style={ styles.textTime }>{ moment(item.time).format('LLL') }</Text>
        </View>
      </View>
    );
  }

  static renderHistoryRow (item, text, textStyle) {
    return (
      <View style={ styles.item }>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          <Text style={ styles.textTime }>{ moment(item.time).format('LLL') }</Text>
        </View>
      </View>
    );
  }

  renderHistoryItem ({ item }) {
    switch (item.event) {
      case 'buyGreenery':
        return HistoryPopup.renderHistoryIconRow(
          item,
          ImageIconGreenery,
          'Purchased Greenery',
          [ styles.text, styles.textIncrease ]
        );

      case 'buyTemperature':
        return HistoryPopup.renderHistoryIconRow(
          item,
          ImageIconTemperature,
          'Purchased Temperature',
          [ styles.text, styles.textIncrease ]
        );

      case 'calculation': {
        const { type, change } = item.payload;

        const trackerInfo = TRACKER_INFOS[type];
        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        const changeText = change >= 0 ? '+' + change : change;
        const changeStyle = change >= 0 ? styles.textIncrease : styles.textDecrease;

        return HistoryPopup.renderHistoryIconRow(
          item,
          icon,
          `Adjusted ${ title } by ${ changeText }`,
          [ styles.text, changeStyle ]
        );
      }

      case 'decrement': {
        const type = item.payload.type;

        const trackerInfo = TRACKER_INFOS[type];
        const icon = trackerInfo.icon;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return HistoryPopup.renderHistoryIconRow(
              item,
              icon,
              `Decreased ${ title } by 1`,
              [ styles.text, styles.textDecrease ]
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              item,
              `Returning to ${ title } ${ item.state.generation }`,
              styles.text
            );

          default:
            return HistoryPopup.renderHistoryIconRow(
              item,
              icon,
              `Decreased ${ title } production by 1`,
              [ styles.text, styles.textDecrease ],
              true
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
              item,
              icon,
              `Increased ${ title } by 1`,
              [ styles.text, styles.textIncrease ]
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              item,
              `Starting ${ title } ${ item.state.generation }`,
              styles.text
            );

          default:
            return HistoryPopup.renderHistoryIconRow(
              item,
              icon,
              `Increased ${ title } production by 1`,
              [ styles.text, styles.textIncrease ],
              true
            );
        }
      }

      case 'newGame':
        return HistoryPopup.renderHistoryRow(
          item,
          'New Game!',
          styles.text
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

  iconResource: {
    width: '2.2rem',
    height: '2.2rem'
  },

  iconProduction: {
    width: '1.7rem',
    height: '1.7rem'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: '0.3rem'
  },

  production: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginRight: '0.5rem',
    padding: '0.25rem'
  },

  resource: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: '0.5rem'
  },

  text: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginTop: '-0.175rem'
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
