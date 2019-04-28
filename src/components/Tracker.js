import React, { Component } from 'react';

import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import ImageIconEnergy from '../../resources/images/icon_energy.png';
import ImageIconHeat from '../../resources/images/icon_heat.png';
import ImageIconMegaCredits from '../../resources/images/icon_mega_credits.png';
import ImageIconPlants from '../../resources/images/icon_plants.png';
import ImageIconSteel from '../../resources/images/icon_steel.png';
import ImageIconTerraformingRating from '../../resources/images/icon_terraforming_rating.png';
import ImageIconTitanium from '../../resources/images/icon_titanium.png';

import Button from './Button';

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

export const TRACKER_INFOS = {
      [TRACKER_TYPES.TERRAFORMING_RATING]: {
        image: ImageIconTerraformingRating,
        hideTitleInTracker: true,
        usePositiveCalculator: true,
        title: 'Terraforming Rating',
        color: '#ED721F',
      },
      [TRACKER_TYPES.MEGACREDITS]: {
        image: ImageIconMegaCredits,
        title: 'MegaCredits',
        color: '#FFCC33'
      },
      [TRACKER_TYPES.STEEL]: {
        image: ImageIconSteel,
        title: 'Steel',
        color: '#B37D43',
        multiplier: 2
      },
      [TRACKER_TYPES.TITANIUM]: {
        image: ImageIconTitanium,
        title: 'Titanium',
        color: '#777777',
        multiplier: 3
      },
      [TRACKER_TYPES.PLANTS]: {
        image: ImageIconPlants,
        title: 'Plants',
        color: '#5FB365'
      },
      [TRACKER_TYPES.ENERGY]: {
        image: ImageIconEnergy,
        title: 'Energy',
        color: '#A34Cb8'
      },
      [TRACKER_TYPES.HEAT]: {
        image: ImageIconHeat,
        title: 'Heat',
        color: '#ED4E44',
        multiplier: 1
      },
      [TRACKER_TYPES.GENERATION]: {
        title: 'Generation',
        color: '#5B8BDD',
        useDebounce: true
      }
    };

export default class Tracker extends Component {

  static getTrackerInfo = (type) => {
    return TRACKER_INFOS[type]
  };

  renderButton = (icon, onPress) => {
    const { type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];

    if (onPress) {
      return (
        <Button
          style={ styles.button }
          backgroundColor="#FFFFFF"
          color="#222222"
          icon={ icon }
          onPress={ () => onPress(type) }
          useDebounce={ trackerInfo.useDebounce }
        />
      );
    }

    return null;
  };

  renderImage = () => {
    const { type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];
    const icon = trackerInfo.image;
    const hideIconInTracker = trackerInfo.hideIconInTracker;

    if (icon && !hideIconInTracker) {
      return (
        <Image style={ styles.headerIcon } resizeMode="contain" source={ icon } />
      );
    }

    return null;
  };

  renderRate = () => {
    const { rate } = this.props;

    if (rate !== undefined) {
      return (
        <Text style={ styles.rateText }>{ rate }</Text>
      );
    }

    return null;
  };

  renderTitle = () => {
    const { type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];
    const { title, hideTitleInTracker } = trackerInfo;

    if (!hideTitleInTracker) {
      let headerTextStyle;

      switch (type) {
        case TRACKER_TYPES.TERRAFORMING_RATING:
        case TRACKER_TYPES.GENERATION:
          headerTextStyle = styles.headerTextSmall;

          break;

        default:
          headerTextStyle = styles.headerTextLarge;
      }

      return (
        <Text style={ headerTextStyle }>{ title }</Text>
      );
    }

    return null;
  };

  render () {
    const { count, onDecrement, onHistory, onIncrement, onPress, style, type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];

    let colorStyle;
    let countTextStyle;

    switch (type) {
      case TRACKER_TYPES.TERRAFORMING_RATING:
      case TRACKER_TYPES.GENERATION:
        colorStyle = { color: trackerInfo.color };
        countTextStyle = styles.countTextSmall;

        break;

      default:
        countTextStyle = styles.countTextLarge;
    }

    return (
      <Button
        style={ style }
        backgroundColor={ trackerInfo.color }
        onPress={ () => onPress(type) }
      >
        <View style={ styles.header }>
          { this.renderImage() }
          { this.renderTitle() }
        </View>
        <View style={ styles.count }>
          <Text style={ [ countTextStyle, colorStyle ] }>{ count }</Text>
        </View>
        <TouchableWithoutFeedback>
          <View style={ styles.footer }>
            <View style={ styles.rate }>
              { this.renderButton('bars', onHistory) }
              { this.renderButton('minus', onDecrement) }
              { this.renderRate() }
              { this.renderButton('plus', onIncrement) }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Button>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  button: {
    borderRadius: '0.5rem',
    maxWidth: '2.3rem',
    height: '2.3rem',
    margin: '0.1rem'
  },

  count: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  countTextLarge: {
    fontSize: '4.5rem',
    textAlign: 'center',
    color: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.5
    },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    marginVertical: '-1rem'
  },

  countTextSmall: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333',
    marginVertical: '-1rem'
  },

  footer: {
    borderBottomRightRadius: '0.7rem',
    borderBottomLeftRadius: '0.7rem',
    paddingHorizontal: '0.1rem',
    paddingTop: '0.35rem',
    paddingBottom: '0.3rem'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem',
    paddingHorizontal: '0.45rem'
  },

  headerIcon: {
    flex: 1,
    height: '1.6rem',
    marginRight: '0.2rem'
  },

  headerTextLarge: {
    flex: 4,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0.2rem'
  },

  headerTextSmall: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    width: '100%'
  },

  rate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.2rem'
  },

  rateText: {
    fontSize: '2.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-1rem'
  }

});
