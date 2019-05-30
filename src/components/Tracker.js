import React, { Component } from 'react';

import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeCount, changeProduction, nextGeneration } from '../store/economy/economyActions';
import { RESOURCE_TYPES, RESOURCE_INFOS } from '../store/economy/economyConstants';

import Button from './Button';

import { showPopup } from './popups/Popups';

const BottomButton = (props) => {
  const { icon, onPress, useDebounce } = props;

  return (
    <Button
      style={ styles.button }
      backgroundColor="#FFFFFF"
      color="#222222"
      icon={ icon }
      onPress={ onPress }
      useDebounce={ useDebounce }
    />
  );
};

class Tracker extends Component {

  static getTrackerInfo = (type) => {
    return RESOURCE_INFOS[type]
  };

  onButton1 = () => {
    const { type } = this.props;

    switch (type) {
      case RESOURCE_TYPES.TERRAFORMING_RATING:
        this.props.actions.changeCount(type, -1);
        break;

      case RESOURCE_TYPES.GENERATION:
        showPopup('history');
        break;

      default:
        this.props.actions.changeProduction(type, -1);
    }
  };

  onButton2 = () => {
    const { type } = this.props;

    switch (type) {
      case RESOURCE_TYPES.TERRAFORMING_RATING:
        this.props.actions.changeCount(type, 1);
        break;

      case RESOURCE_TYPES.GENERATION:
        this.props.actions.nextGeneration();
        break;

      default:
        this.props.actions.changeProduction(type, 1);
    }
  };

  onTracker = () => {
    const { type } = this.props;

    if (type === RESOURCE_TYPES.GENERATION) {
      showPopup('history');

      return;
    }

    showPopup('calculator', { type });
  };

  renderImage = () => {
    const { type } = this.props;
    const { image } = RESOURCE_INFOS[type];

    if (!image) {
      return null;
    }

    return (
      <Image style={ styles.headerImage } resizeMode="contain" source={ image } />
    );
  };

  renderProduction = () => {
    const { production } = this.props;

    if (production === undefined) {
      return null;
    }

    return (
      <Text style={ styles.productionText }>{ production }</Text>
    );
  };

  renderTitle = () => {
    const { type } = this.props;
    const { title, hideTitleInTracker, useSmallTracker } = RESOURCE_INFOS[type];

    if (hideTitleInTracker) {
      return null;
    }

    const textStyle = useSmallTracker ? styles.headerTextSmall : styles.headerTextLarge;

    return (
      <Text style={ textStyle }>{ title }</Text>
    );
  };

  render () {
    const { count, style, type } = this.props;
    const { color, button1Icon, button2Icon, useDebounce, useSmallTracker } = RESOURCE_INFOS[type];

    const colorStyle = useSmallTracker ? { color } : null;
    const countTextStyle = useSmallTracker ? styles.countTextSmall : styles.countTextLarge;

    return (
      <Button
        style={ style }
        backgroundColor={ color }
        onPress={ this.onTracker }
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
            <View style={ styles.production }>
              <BottomButton
                icon={ button1Icon || 'minus' }
                onPress={ this.onButton1 }
                useDebounce={ useDebounce }
              />
              { this.renderProduction() }
              <BottomButton
                icon={ button2Icon || 'plus' }
                onPress={ this.onButton2 }
                useDebounce={ useDebounce }
              />
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
    fontSize: '4rem',
    textAlign: 'center',
    color: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.5
    },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    marginTop: '-1.1rem',
    marginBottom: '-1rem'
  },

  countTextSmall: {
    fontSize: '3rem',
    textAlign: 'center',
    color: '#333333',
    marginTop: '-1.05rem',
    marginBottom: '-1rem'
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

  headerImage: {
    flex: 1,
    height: '1.6rem',
    marginRight: '0.4rem'
  },

  headerTextLarge: {
    flex: 4,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#222222'
  },

  headerTextSmall: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF'
  },

  production: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '0.2rem'
  },

  productionText: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: '-1rem'
  }

});

const mapStateToProps = (state, props) => {
  const { economy } = state;

  return {
    count: economy.resourceCounts[props.type],
    production: economy.resourceProductions[props.type],
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    changeCount,
    changeProduction,
    nextGeneration
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);