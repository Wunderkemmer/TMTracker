import React, { Component } from 'react';

import { Image, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ImageIconEnergy from '../resources/images/icon_energy.png';
import ImageIconHeat from '../resources/images/icon_heat.png';
import ImageIconMegaCredits from '../resources/images/icon_mega_credits.png';
import ImageIconPlants from '../resources/images/icon_plants.png';
import ImageIconSteel from '../resources/images/icon_steel.png';
import ImageIconTerraformingRating from '../resources/images/icon_terraforming_rating.png';
import ImageIconTitanium from '../resources/images/icon_titanium.png';

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
    icon: ImageIconTerraformingRating,
    hideTitleInTracker: true,
    title: 'Terraforming Rating',
    color: '#6BB1A6'
  },
  [TRACKER_TYPES.MEGACREDITS]: {
    icon: ImageIconMegaCredits,
    title: 'MegaCredits',
    color: '#FFCC33'
  },
  [TRACKER_TYPES.STEEL]: {
    icon: ImageIconSteel,
    title: 'Steel',
    color: '#9B734D'
  },
  [TRACKER_TYPES.TITANIUM]: {
    icon: ImageIconTitanium,
    title: 'Titanium',
    color: '#777777'
  },
  [TRACKER_TYPES.PLANTS]: {
    icon: ImageIconPlants,
    title: 'Plants',
    color: '#5FB365'
  },
  [TRACKER_TYPES.ENERGY]: {
    icon: ImageIconEnergy,
    title: 'Energy',
    color: '#9855B8'
  },
  [TRACKER_TYPES.HEAT]: {
    icon: ImageIconHeat,
    title: 'Heat',
    color: '#ED5430'
  },
  [TRACKER_TYPES.GENERATION]: {
    title: 'Generation',
    color: '#5B8BDD'
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

    return null;
  };

  renderIcon = () => {
    const { type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];
    const icon = trackerInfo.icon;
    const hideIconInTracker = trackerInfo.hideIconInTracker;

    if (icon && !hideIconInTracker) {
      return (
        <Image style={ styles.headerIcon } resizeMode="contain" source={ icon } />
      );
    }

    return null;
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
    const { count, onDecrement, onIncrement, onPress, style, type } = this.props;

    const trackerInfo = TRACKER_INFOS[type];
    const backgroundColorStyle = { backgroundColor: trackerInfo.color };

    const rateStyle = onDecrement && onIncrement ?
      styles.rateDual :
      styles.rateSingle;

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
      <TouchableOpacity style={ [ styles.border, style ] } onPress={ () => onPress(type) }>
        <View style={ [ styles.container, backgroundColorStyle ] }>
          <View style={ styles.header }>
            { this.renderIcon() }
            { this.renderTitle() }
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
    backgroundColor: '#222222',
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
    borderColor: '#333333',
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
    fontSize: '1.2rem',
    color: '#333333'
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
    marginBottom: '-1rem'
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem',
    paddingHorizontal: '0.45rem'
  },

  headerIcon: {
    flex: 1,
    height: '1.6rem'
  },

  headerTextLarge: {
    flex: 4,
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    margin: '0.2rem'
  },

  headerTextSmall: {
    fontSize: '0.9rem',
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
