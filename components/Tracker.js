import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const TRACKER_TYPES = {
  TERRAFORMING_RATING: 'terraformingRating',
  MEGACREDITS: 'megacredits',
  STEEL: 'steel',
  TITANIUM: 'titanium',
  PLANTS: 'plants',
  ENERGY: 'energy',
  HEAT: 'heat',
  GENERATION: 'generation'
};

const trackerInfos = {
  [TRACKER_TYPES.TERRAFORMING_RATING]: {
    title: 'Terraforming\nRating',
    color: '#4BD186'
  },
  [TRACKER_TYPES.MEGACREDITS]: {
    title: 'MegaCredits',
    color: '#FFCC33'
  },
  [TRACKER_TYPES.STEEL]: {
    title: 'Steel',
    color: '#9B734D'
  },
  [TRACKER_TYPES.TITANIUM]: {
    title: 'Titanium',
    color: '#999999'
  },
  [TRACKER_TYPES.PLANTS]: {
    title: 'Plants',
    color: '#4FA355'
  },
  [TRACKER_TYPES.ENERGY]: {
    title: 'Energy',
    color: '#8845a8'
  },
  [TRACKER_TYPES.HEAT]: {
    title: 'Heat',
    color: '#D67220'
  },
  [TRACKER_TYPES.GENERATION]: {
    title: 'Generation',
    color: '#4B8BD1'
  }
};

export default class Tracker extends Component {

  renderDecrement = () => {
    const { onDecrement, type } = this.props;

    if (onDecrement) {
      return (
        <TouchableOpacity
          style={ styles.button }
          onPress={ () => onDecrement(type) }
        >
          <FontAwesome5 style={ styles.buttonIcon } name={ 'minus' } />
        </TouchableOpacity>
      );
    }
  };

  renderIncrement = () => {
    const { onIncrement, type } = this.props;

    if (onIncrement) {
      return (
        <TouchableOpacity
          style={ styles.button }
          onPress={ () => onIncrement(type) }
        >
          <FontAwesome5 style={ styles.buttonIcon } name={ 'plus' } />
        </TouchableOpacity>
      );
    }
  };

  renderRate = () => {
    const { rate } = this.props;

    if (rate !== undefined) {
      return (
        <Text style={ styles.rateText }>{ rate }</Text>
      );
    }
  };

  render () {
    const { count, onDecrement, onIncrement, onPress, style, type } = this.props;

    const trackerInfo = trackerInfos[type];
    const backgroundColorStyle = { backgroundColor: trackerInfo.color };
    const title = trackerInfo.title;

    const rateStyle = onDecrement && onIncrement ?
      styles.rateDual :
      styles.rateSingle;

    let colorStyle;
    let countTextStyle;
    let headerTextStyle;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
      case TRACKER_TYPES.GENERATION:
        colorStyle = { color: trackerInfo.color };
        countTextStyle = styles.countTextSmall;
        headerTextStyle = styles.headerTextSmall;

        break;

      default:
        countTextStyle = styles.countTextLarge;
        headerTextStyle = styles.headerTextLarge;
    }

    return (
      <TouchableOpacity style={ [ styles.border, style ] } onPress={ () => onPress(type) }>
        <View style={ [ styles.container, backgroundColorStyle ] }>
          <View style={ styles.header }>
            <Text style={ headerTextStyle }>{ title }</Text>
          </View>
          <View style={ styles.count }>
            <Text style={ [ countTextStyle, colorStyle ] }>{ count }</Text>
          </View>
          <View style={ styles.footer }>
            <View style={ rateStyle }>
              { this.renderDecrement() }
              { this.renderRate() }
              { this.renderIncrement() }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  border: {
    backgroundColor: '#444444',
    flex: 1,
    borderRadius: '0.8rem',
    margin: '0.2rem',
    padding: '0.15rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2.5
    },
    shadowRadius: 2,
    shadowOpacity: 0.25
  },

  button: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#555555',
    borderWidth: 3,
    borderRadius: '0.5rem',
    width: '2.1rem',
    height: '2.1rem',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.5
    },
    shadowRadius: 1,
    shadowOpacity: 0.5
  },

  buttonIcon: {
    fontSize: '1.3rem',
    color: '#555555'
  },

  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderRadius: '0.7rem'
  },

  count: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  countTextLarge: {
    fontSize: '4.25rem',
    textAlign: 'center',
    color: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.5
    },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    marginTop: '-1rem',
    marginBottom: '-1rem',
  },

  countTextSmall: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333',
    marginTop: '-1rem',
    marginBottom: '-1rem'
  },

  footer: {
    borderBottomRightRadius: '0.7rem',
    borderBottomLeftRadius: '0.7rem',
    paddingHorizontal: '0.1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem'
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem'
  },

  headerTextLarge: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  },

  headerTextSmall: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  },

  rate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.4rem'
  },

  rateDual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.4rem'
  },

  rateSingle: {
    alignItems: 'center'
  },

  rateText: {
    fontSize: '2.3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-0.5rem'
  }

});
