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

  static renderChange (type, change, time, isProduction, key) {
    const trackerInfo = TRACKER_INFOS[type];
    const image = trackerInfo.image;
    const title = trackerInfo.title;

    let changeText = `${change} ${ title }`;

    changeText = change > 0 ? `+${changeText}` : changeText;
    changeText = isProduction ? `${changeText} production` : changeText;

    const changeStyle = change === 0 ?
      styles.text :
      (change > 0 ? styles.textIncrease : styles.textDecrease);

    return HistoryPopup.renderImageRow(
      image,
      changeText,
      [ styles.text, changeStyle ],
      time,
      isProduction,
      key
    );
  }

  static renderImageRow (image, text, textStyle, time, isProduction, key) {
    const itemStyle = time ? styles.item : styles.itemSecondary;

    const frameStyle = isProduction ?
      (time ? styles.production : styles.productionSecondary) :
      styles.resource;

    const imageStyle = time ?
      (isProduction ? styles.imageProduction : styles.imageResource) :
      (isProduction ? styles.imageProductionSecondary : styles.imageResourceSecondary);

    const textSizeStyle = time ? styles.textSize : styles.textSizeSecondary;

    return (
      <View style={ itemStyle } key={ key }>
        <View style={ frameStyle }>
          <Image style={ imageStyle } resizeMode="contain" source={ image } />
        </View>
        <View>
          <Text style={ [ textStyle, textSizeStyle ] }>{ text }</Text>
          { HistoryPopup.renderTime(time) }
        </View>
      </View>
    );
  }

  static renderTextRow (text, textStyle, time, key) {
    return (
      <View style={ styles.item } key={ key }>
        <View>
          <Text style={ textStyle }>{ text }</Text>
          { HistoryPopup.renderTime(time) }
        </View>
      </View>
    );
  }

  static renderHistoryItem ({ item }) {
    const { event, payload, state, time } = item;

    const renderChange = HistoryPopup.renderChange;
    const renderImageRow = HistoryPopup.renderImageRow;
    const renderOxygen = HistoryPopup.renderOxygen;
    const renderTextRow = HistoryPopup.renderTextRow;

    const decrease = [ styles.text, styles.textDecrease ];
    const increase = [ styles.text, styles.textIncrease ];

    switch (event) {
      case 'buyAquifer': {
        const { oceanCount } = payload;

        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

        return (
          <Fragment>
            { renderImageRow(ImageIconOcean, `Purchased Aquifer`, increase, time) }
            { renderImageRow(ImageIconOcean, `Ocean ${ oceanCount } added`, increase) }
            { renderImageRow(trackerInfo.image, `+1 Terraforming Rating`, increase) }
            { renderChange(TRACKER_TYPES.MEGACREDITS, -PROJECT_INFOS[PROJECT_TYPES.BUY_AQUIFER].cost) }
          </Fragment>
        );
      }

      case 'buyCity': {
        return (
          <Fragment>
            { renderImageRow(ImageIconCity, `Purchased City`, increase, time) }
            { renderChange(TRACKER_TYPES.MEGACREDITS, 1, null, true) }
            { renderChange(TRACKER_TYPES.MEGACREDITS, -PROJECT_INFOS[PROJECT_TYPES.BUY_CITY].cost) }
          </Fragment>
        );
      }

      case 'buyGreenery': {
        const { type, wasOxygenAdded } = payload;

        const plantCost = 8;
        const megaCreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_GREENERY].cost;

        const isPlants = type === TRACKER_TYPES.PLANTS;
        const change = isPlants ? -plantCost : -megaCreditCost;
        const title = isPlants ? 'Exchanged Plants for Greenery' : 'Purchased Greenery';

        return (
          <Fragment>
            { renderImageRow(ImageIconGreenery, title, increase, time) }
            { renderOxygen(wasOxygenAdded, state.oxygenLevel) }
            { renderChange(type, change) }
          </Fragment>
        );
      }

      case 'buyPowerPlant': {
        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.ENERGY];

        return (
          <Fragment>
            { renderImageRow(trackerInfo.image, `Purchased Power Plant`, increase, time, true) }
            { renderChange(TRACKER_TYPES.ENERGY, 1, null, true) }
            { renderChange(TRACKER_TYPES.MEGACREDITS, -PROJECT_INFOS[PROJECT_TYPES.BUY_POWER_PLANT].cost) }
          </Fragment>
        );
      }

      case 'buyTemperature': {
        const { type } = payload;

        const heatCost = 8;
        const megaCreditCost = PROJECT_INFOS[PROJECT_TYPES.BUY_ASTEROID].cost;

        const isHeat = type === TRACKER_TYPES.HEAT;
        const change = isHeat ? -heatCost : -megaCreditCost;
        const title = isHeat ? 'Exchanged Heat for Temperature' : 'Purchased Asteroid';

        const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

        return (
          <Fragment>
            { renderImageRow(ImageIconTemperature, title, increase, time) }
            { renderImageRow(ImageIconTemperature, `Temperature at ${ state.temperature }°C`, increase) }
            { renderImageRow(trackerInfo.image, `+1 Terraforming Rating`, increase) }
            { renderChange(type, change) }
          </Fragment>
        );
      }

      case 'change': {
        const { changes } = payload;

        return changes.map((change, index) => {
          const { type, value } = change;

          return renderChange(type, value, index === 0 ? time : null, false, `change.${ index }`);
        });
      }

      case 'decrement': {
        const { type } = payload;

        const trackerInfo = TRACKER_INFOS[type];
        const image = trackerInfo.image;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return renderImageRow(image, `-1 ${ title }`, decrease, time);

          case TRACKER_TYPES.GENERATION:
            return renderTextRow(`Returning to ${ title } ${ state.generation }`, styles.text, time);

          default:
            return renderImageRow(image, `-1 ${ title } production`, decrease, time, true);
        }
      }

      case 'increment': {
        const { type } = payload;

        const trackerInfo = TRACKER_INFOS[type];
        const image = trackerInfo.image;
        const title = trackerInfo.title;

        switch (type) {
          case TRACKER_TYPES.TERRAFORMING_RATING:
            return renderImageRow(image, `+1 ${ title }`, increase, time);

          case TRACKER_TYPES.GENERATION:
            return renderTextRow(`Starting ${ title } ${ state.generation }`, styles.text, time);

          default:
            return renderImageRow(image, `+1 ${ title } production`, increase, time, true);
        }
      }

      case 'newGame':
        return renderTextRow('New Game!', styles.text, time);

      case 'oceanCount': {
        return renderImageRow(ImageIconOcean, `Ocean ${ state.oceanCount } added`, increase, time);
      }

      case 'oxygenLevel': {
        return renderImageRow(ImageIconOxygen, `Oxygen level at ${ state.oxygenLevel }%`, increase, time);
      }

      case 'sellPatent': {
        return (
          <Fragment>
            { renderImageRow(ImageIconCard, `Sold Patent`, decrease, time) }
            { renderChange(TRACKER_TYPES.MEGACREDITS, -PROJECT_INFOS[PROJECT_TYPES.SELL_PATENT].cost) }
            { renderImageRow(ImageIconCard, `-1 Cards`, decrease) }
          </Fragment>
        );
      }

      case 'temperature': {
        return renderImageRow(ImageIconTemperature, `Temperature at ${ state.temperature }°C`, increase, time);
      }
    }
  }

  static renderOxygen (wasOxygenAdded, oxygenLevel) {
    const trackerInfo = TRACKER_INFOS[TRACKER_TYPES.TERRAFORMING_RATING];

    if (!wasOxygenAdded) {
      return;
    }

    const renderImageRow = HistoryPopup.renderImageRow;

    const increase = [ styles.text, styles.textIncrease ];

    return (
      <Fragment>
        { renderImageRow(ImageIconOxygen, `Oxygen level at ${ oxygenLevel }%`, increase) }
        { renderImageRow(trackerInfo.image, `+1 Terraforming Rating`, increase) }
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
    const { history } = this.props;
    const reverseHistory = [ ...history ].reverse();

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ reverseHistory }
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
    paddingTop: '0.5rem',
    paddingBottom: '1rem'
  },

  imageResource: {
    width: '2.2rem',
    height: '2.2rem'
  },

  imageResourceSecondary: {
    width: '1.2rem',
    height: '1.2rem'
  },

  imageProduction: {
    width: '1.7rem',
    height: '1.7rem'
  },

  imageProductionSecondary: {
    width: '0.8rem',
    height: '0.8rem'
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '0.8rem'
  },

  itemSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '0.2rem',
    marginLeft: '2.8rem'
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
    marginRight: '0.3rem'
  },

  productionSecondary: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginRight: '0.5rem',
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
