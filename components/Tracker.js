import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
      <View style={ styles.border }>
        <View style={ styles.container }>
          <View style={ [ styles.header, colorStyle ] }>
            <Text style={ styles.headerText }>{ title }</Text>
          </View>
          <View style={ styles.count }>
            <Text style={ styles.countText }>{ count }</Text>
          </View>
          <View style={ [ styles.footer, colorStyle ] }>
            <View style={ styles.production }>
              <TouchableOpacity
                style={ styles.productionButton }
                onPress={ () => onProductionDown(type) }
              >
                <FontAwesome5 style={ styles.productionButtonIcon } name={ 'plus' } />
              </TouchableOpacity>
              <Text style={ styles.productionText }>{ production }</Text>
              <TouchableOpacity
                style={ styles.productionButton }
                onPress={ () => onProductionUp(type) }
              >
                <FontAwesome5 style={ styles.productionButtonIcon } name={ 'minus' } />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
    marginTop: '-0.5rem',
    marginBottom: '-0.5rem',
  },

  footer: {
    borderBottomRightRadius: '0.7rem',
    borderBottomLeftRadius: '0.7rem',
    paddingHorizontal: '0.2rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.6rem'
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem'
  },

  headerText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  },

  production: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.4rem'
  },

  productionButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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

  productionButtonIcon: {
    fontSize: '1.3rem',
    color: '#555555'
  },

  productionText: {
    fontSize: '2.3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-0.5rem'
  },

  productionTextShrinker: {
    height: '2.0rem'
  }

});
