import moment from 'moment';

import React, { Component, Fragment } from 'react';

import { FlatList, Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

import ImageIconCard from '../../../resources/images/icon_card.png';
import ImageIconCity from '../../../resources/images/icon_city.png';
import ImageIconGreenery from '../../../resources/images/icon_greenery.png';
import ImageIconOcean from '../../../resources/images/icon_ocean.png';
import ImageIconOxygen from '../../../resources/images/icon_oxygen.png';
import ImageIconTemperature from '../../../resources/images/icon_temperature.png';

import { PROJECT_INFOS, PROJECT_TYPES } from './ProjectsPopup';

export default class HistoryPopup extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  static renderChange (type, change, time, isProduction, index = 0) {
    const trackerInfo = TRACKER_INFOS[type];
    const image = trackerInfo.image;
    const title = trackerInfo.title;

    const changeText = isProduction ?
      `${ title } production +` + change :
      (change > 0 ? `+${change} ${ title }` : `${change} ${ title }`);

    const changeStyle = change === 0 ?
      styles.text :
      (change > 0 ? styles.textIncrease : styles.textDecrease);

    return HistoryPopup.renderHistoryImageRow(
      image,
      changeText,
      [ styles.text, changeStyle ],
      time,
      isProduction,
      `change.${ index }`
    );
  }

  static renderHistoryImageRow (image, text, textStyle, time, isProduction, key = '') {
    const frameStyle = isProduction ?
      (time ? styles.production : styles.productionSecondary) :
      styles.resource;

    const itemStyle = time ? styles.item : styles.itemSecondary;

    const iconStyle = time ?
      (isProduction ? styles.iconProduction : styles.iconResource) :
      (isProduction ? styles.iconProductionSecondary : styles.iconResourceSecondary);

    const textSizeStyle = time ? styles.textSize : styles.textSizeSecondary;

    return (
      <View style={ itemStyle } key={ key }>
        <View style={ frameStyle }>
          <Image style={ iconStyle } resizeMode="contain" source={ image } />
        </View>
        <View>
          <Text style={ [ textStyle, textSizeStyle ] }>{ text }</Text>
          { this.renderTime(time) }
        </View>
      </View>
    );
  }

  static renderHistoryRow (text, textStyle, time, key = '') {
    return (
      <View style={ styles.item } key={ key }>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          { this.renderTime(time) }
        </View>
      </View>
    );
  }

  static renderHistoryItem ({ item }) {
    const { event, payload, state, time } = item;

    switch (event) {
      case 'buyAquifer': {
        const { oceanCount } = payload;

        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                ImageIconOcean,
                `Purchased Ocean ${ oceanCount }`,
                [ styles.text, styles.textIncrease ],
                time
              )
            }
            {
              HistoryPopup.renderHistoryImageRow(
                trackerInfo.image,
                `+1 Terraforming Rating`,
                [ styles.text, styles.textIncrease ],
                null,
                false,
                `terraformingRating`
              )
            }
            {
              HistoryPopup.renderChange(
                TRACKER_TYPES.MEGACREDITS,
                -PROJECT_INFOS[PROJECT_TYPES.BUY_AQUIFER].cost
              )
            }
          </Fragment>
        );
      }

      case 'buyCity': {
        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                ImageIconCity,
                `Purchased City`,
                [ styles.text, styles.textIncrease ],
                time
              )
            }
            {
              HistoryPopup.renderChange(TRACKER_TYPES.MEGACREDITS, 1, null, true, 0)
            }
            {
              HistoryPopup.renderChange(
                TRACKER_TYPES.MEGACREDITS,
                -PROJECT_INFOS[PROJECT_TYPES.BUY_CITY].cost,
                null,
                false,
                1
              )
            }
          </Fragment>
        );
      }

      case 'buyGreenery': {
        const { type } = payload;

        const plantCost = 8;
        const megaCreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_GREENERY].cost;

        const isPlants = type === TRACKER_TYPES.PLANTS;

        const change = isPlants ? -plantCost : -megaCreditCost;
        const title = isPlants ? 'Purchased Greenery' : 'Purchased Greenery';

        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                ImageIconGreenery,
                title,
                [ styles.text, styles.textIncrease ],
                time
              )
            }
            { HistoryPopup.renderOxygen(state.oxygenLevel) }
            { HistoryPopup.renderChange(type, change) }
          </Fragment>
        );
      }

      case 'buyPowerPlant': {
        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.ENERGY];

        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                trackerInfo.image,
                `Purchased Power Plant`,
                [ styles.text, styles.textIncrease ],
                time,
                true
              )
            }
            {
              HistoryPopup.renderChange(TRACKER_TYPES.ENERGY, 1, null, true, 0)
            }
            {
              HistoryPopup.renderChange(
                TRACKER_TYPES.MEGACREDITS,
                -PROJECT_INFOS[PROJECT_TYPES.BUY_POWER_PLANT].cost,
                null,
                false,
                1
              )
            }
          </Fragment>
        );
      }

      case 'buyTemperature': {
        const { type } = payload;

        const heatCost = 8;
        const megaCreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_ASTEROID].cost;

        const isHeat = type === TRACKER_TYPES.HEAT;

        const change = isHeat ? -heatCost : -megaCreditCost;
        const title = isHeat ? 'Purchased Temperature' : 'Purchased Asteroid';

        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                ImageIconTemperature,
                title,
                [ styles.text, styles.textIncrease ],
                time
              )
            }
            {
              HistoryPopup.renderHistoryImageRow(
                trackerInfo.image,
                `+1 Terraforming Rating`,
                [ styles.text, styles.textIncrease ],
                null,
                false,
                `terraformingRating`
              )
            }
            { HistoryPopup.renderChange(type, change) }
          </Fragment>
        );
      }

      case 'change': {
        const { changes } = payload;

        return changes.map((change, index) => {
          const { type, value } = change;

          return HistoryPopup.renderChange(type, value, index === 0 ? time : null, false, index);
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
              `-1 ${ title }`,
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
              `-1 ${ title } production`,
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
              `+1 ${ title }`,
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
              `+1 ${ title } production`,
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

      case 'oceanCount': {
        return HistoryPopup.renderHistoryImageRow(
          ImageIconOcean,
          `Ocean ${ state.oceanCount } added`,
          [ styles.text, styles.textIncrease ],
          time
        );
      }

      case 'oxygenLevel': {
        return HistoryPopup.renderHistoryImageRow(
          ImageIconOxygen,
          `Oxygen level at ${ state.oxygenLevel }%`,
          [ styles.text, styles.textIncrease ],
          time
        );
      }

      case 'sellPatent': {
        return (
          <Fragment>
            {
              HistoryPopup.renderHistoryImageRow(
                ImageIconCard,
                `Sold Patent`,
                [ styles.text, styles.textDecrease ],
                time
              )
            }
            {
              HistoryPopup.renderChange(
                TRACKER_TYPES.MEGACREDITS,
                -PROJECT_INFOS[PROJECT_TYPES.SELL_PATENT].cost
              )
            }
          </Fragment>
        );
      }

      case 'temperature': {
        return HistoryPopup.renderHistoryImageRow(
          ImageIconTemperature,
          `Temperature at ${ state.temperature }°C`,
          [ styles.text, styles.textIncrease ],
          time
        );
      }
    }
  }

  static renderOxygen (oxygenLevel) {
    const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

    return (
      <Fragment>
        {
          HistoryPopup.renderHistoryImageRow(
            ImageIconOxygen,
            `Oxygen level at ${ oxygenLevel }%`,
            [ styles.text, styles.textIncrease ],
            null,
            false,
            `oxygen`
          )
        }
        {
          HistoryPopup.renderHistoryImageRow(
            trackerInfo.image,
            `+1 Terraforming Rating`,
            [ styles.text, styles.textIncrease ],
            null,
            false,
            `terraformingRating`
          )
        }
      </Fragment>
    )
  }

  static renderTime (time) {
    if (!time) {
      return null;
    }

    return (
      <Text style={ styles.textTime }>{ moment(time).format('LL LTS') }</Text>
    );
  }

  render () {
    const { history = [] } = this.props;

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ [ ...history ].reverse() }
        keyExtractor={ this.keyExtractor }
        renderItem={ HistoryPopup.renderHistoryItem }
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

  iconResourceSecondary: {
    width: '1.2rem',
    height: '1.2rem'
  },

  iconProduction: {
    width: '1.7rem',
    height: '1.7rem'
  },

  iconProductionSecondary: {
    width: '0.8rem',
    height: '0.8rem'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '0.6rem'
  },

  itemSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '0.35rem',
    marginLeft: '2.6rem'
  },

  production: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginRight: '0.3rem',
    padding: '0.25rem'
  },

  resource: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: '0.3rem'
  },

  productionSecondary: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginRight: '0.3rem',
    padding: '0.15rem'
  },

  text: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginTop: '-0.175rem'
  },

  textSize: {
    fontSize: '1.2rem',
  },

  textSizeSecondary: {
    fontSize: '0.9rem',
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
