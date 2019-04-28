import moment from 'moment';

import React, { Component } from 'react';

import { FlatList, Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

export default class HistoryPopup extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  static renderHistoryImageRow (image, text, textStyle, time, isProduction, key = '') {
    const frameStyle = isProduction ? styles.production : styles.resource;
    const iconStyle = isProduction ? styles.iconProduction : styles.iconResource;

    return (
      <View style={ styles.item } key={ key }>
        <View style={ frameStyle }>
          <Image style={ iconStyle } resizeMode="contain" source={ image } />
        </View>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          <Text style={ styles.textTime }>{ moment(time).format('LL LTS') }</Text>
        </View>
      </View>
    );
  }

  static renderHistoryRow (text, textStyle, time, key = '') {
    return (
      <View style={ styles.item } key={ key }>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          <Text style={ styles.textTime }>{ moment(time).format('LL LTS') }</Text>
        </View>
      </View>
    );
  }

  renderHistoryItem ({ item }) {
    const { event, payload, state, time } = item;

    switch (event) {
      case 'buyGreenery':
        return HistoryPopup.renderHistoryImageRow(
          ImageIconGreenery,
          'Purchased Greenery',
          [ styles.text, styles.textIncrease ],
          time
        );

      case 'buyTemperature':
        return HistoryPopup.renderHistoryImageRow(
          ImageIconTemperature,
          'Purchased Temperature',
          [ styles.text, styles.textIncrease ],
          time
        );

      case 'calculation': {
        const { changes } = payload;

        return changes.map((change, index) => {
          const type = change.type;
          const value = change.value;

          const trackerInfo = TRACKER_INFOS[type];
          const image = trackerInfo.image;
          const title = trackerInfo.title;

          const changeText = value >= 0 ? '+' + value : value;
          const changeStyle = value >= 0 ? styles.textIncrease : styles.textDecrease;

          return HistoryPopup.renderHistoryImageRow(
            image,
            `Changed ${ title } by ${ changeText }`,
            [ styles.text, changeStyle ],
            time,
            false,
            `change.${ index }`
          );
        });
      }

      case 'decrement': {
        const { type } = payload;

        const trackerInfo = TRACKER_INFOS[type];
        const image = trackerInfo.image;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return HistoryPopup.renderHistoryImageRow(
              image,
              `Decreased ${ title } by 1`,
              [ styles.text, styles.textDecrease ],
              time
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              `Returning to ${ title } ${ state.generation }`,
              styles.text,
              time
            );

          default:
            return HistoryPopup.renderHistoryImageRow(
              image,
              `Decreased ${ title } production by 1`,
              [ styles.text, styles.textDecrease ],
              time,
              true
            );
        }
      }

      case 'increment': {
        const { type } = payload;

        const trackerInfo = TRACKER_INFOS[type];
        const image = trackerInfo.image;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return HistoryPopup.renderHistoryImageRow(
              image,
              `Increased ${ title } by 1`,
              [ styles.text, styles.textIncrease ],
              time
            );

          case TRACKER_TYPES.GENERATION:
            return HistoryPopup.renderHistoryRow(
              `Starting ${ title } ${ state.generation }`,
              styles.text,
              time
            );

          default:
            return HistoryPopup.renderHistoryImageRow(
              image,
              `Increased ${ title } production by 1`,
              [ styles.text, styles.textIncrease ],
              time,
              true
            );
        }
      }

      case 'newGame':
        return HistoryPopup.renderHistoryRow(
          'New Game!',
          styles.text,
          time
        );
    }
  }

  render () {
    const { history = [] } = this.props;

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ [ ...history ].reverse() }
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
