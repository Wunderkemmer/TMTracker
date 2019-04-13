import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

export const TRACKER_TYPES = {
  MEGACREDITS: 'megacredits',
  STEEL: 'steel',
  TITANIUM: 'titanium',
  PLANTS: 'plants',
  ENERGY: 'energy',
  HEAT: 'heat'
};

const trackerInfos = {
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
  }
};

export default class Tracker extends Component {

  render () {
    const { count, onProductionDown, onProductionUp, production, type } = this.props;

    const trackerInfo = trackerInfos[type];
    const colorStyle = { backgroundColor: trackerInfo.color };
    const title = trackerInfo.title;

    return (
      <View style={ styles.container }>
        <View style={ [ styles.header, colorStyle ] }>
          <Text style={ styles.headerText }>{ title }</Text>
        </View>
        <Text style={ styles.countText }>{ count }</Text>
        <View style={ [ styles.footer, colorStyle ] }>
          <Text style={ styles.productionTitle }>PRODUCTION</Text>
          <View style={ styles.production }>
            <TouchableOpacity
              style={ styles.productionButton }
              onPress={ () => onProductionDown(type) }
            >
              <Text style={ styles.productionButtonText }>-</Text>
            </TouchableOpacity>
            <Text style={ styles.productionText }>{ production }</Text>
            <TouchableOpacity
              style={ styles.productionButton }
              onPress={ () => onProductionUp(type) }
            >
              <Text style={ styles.productionButtonText }>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderColor: '#444444',
    borderWidth: 4,
    borderRadius: '0.8rem',
    width: '31.99%',
    margin: '0.2rem'
  },

  countText: {
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
    marginBottom: '0.7rem'
  },

  footer: {
    borderBottomRightRadius: '0.5rem',
    borderBottomLeftRadius: '0.5rem',
    padding: '0.25rem'
  },

  production: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '0.45rem'
  },

  productionButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#555555',
    borderWidth: 2,
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

  productionButtonText: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: '-0.65rem'
  },

  productionText: {
    fontSize: '2.6rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: '-0.5rem',
    marginBottom: '-0.04rem'
  },

  productionTitle: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#999999',
    marginBottom: '-1.55rem'
  },

  header: {
    borderTopRightRadius: '0.5rem',
    borderTopLeftRadius: '0.5rem',
    padding: '0.5rem'
  },

  headerText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  }

});
