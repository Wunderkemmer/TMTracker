import React, { Component } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const COUNTER_TYPES = {
  TERRAFORM_RATING: 'terraformRating',
  GENERATION: 'generation'
};

const trackerInfos = {
  [COUNTER_TYPES.TERRAFORM_RATING]: {
    title: 'Terraform\nRating',
    color: '#4BD186'
  },
  [COUNTER_TYPES.GENERATION]: {
    title: 'Generation',
    color: '#4B8BD1'
  }
};

export default class Counter extends Component {

  renderCounterDown = () => {
    const { onCounterDown, type } = this.props;

    if (onCounterDown) {
      return (
        <TouchableOpacity
          style={ styles.counterButton }
          onPress={ () => onCounterDown(type) }
        >
          <FontAwesome5 style={ styles.counterButtonIcon } name={ 'minus' } />
        </TouchableOpacity>
      );
    }
  };

  renderCounterUp = () => {
    const { onCounterUp, type } = this.props;

    if (onCounterUp) {
      return (
        <TouchableOpacity
          style={ styles.counterButton }
          onPress={ () => onCounterUp(type) }
        >
          <FontAwesome5 style={ styles.counterButtonIcon } name={ 'plus' } />
        </TouchableOpacity>
      );
    }
  };

  render () {
    const { count, onCounterDown, onCounterUp, type } = this.props;

    const trackerInfo = trackerInfos[type];
    const colorStyle = { color: trackerInfo.color };
    const backgroundColorStyle = { backgroundColor: trackerInfo.color };
    const title = trackerInfo.title;

    let counterStyle = onCounterDown && onCounterUp ?
      styles.counterDual :
      styles.counterSingle;

    return (
      <View style={ styles.border }>
        <View style={ styles.container }>
          <View style={ [ styles.header, backgroundColorStyle ] }>
            <Text style={ styles.headerText }>{ title }</Text>
          </View>
          <View style={ styles.count }>
            <Text style={ [ styles.countText, colorStyle ] }>{ count }</Text>
          </View>
          <View style={ [ styles.footer, backgroundColorStyle ] }>
            <View style={ counterStyle }>
              { this.renderCounterDown() }
              { this.renderCounterUp() }
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
    borderRadius: '0.8rem',
    margin: '0.2rem',
    marginTop: '0.5rem',
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
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderRadius: '0.7rem'
  },

  count: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },

  countText: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333'
  },

  counterDual: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '0.4rem'
  },

  counterSingle: {
    alignItems: 'center'
  },

  counterButton: {
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

  counterButtonText: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555555',
    height: '2.3rem',
    marginTop: '-0.3rem'
  },

  counterButtonIcon: {
    fontSize: '1.3rem',
    color: '#555555'
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
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  }

});
