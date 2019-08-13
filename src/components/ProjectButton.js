import React, { Component } from 'react';

import { Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getTransactionData } from '../lib/utils';

import { runProject } from '../store/game/gameActions';
import { PROJECT_INFOS } from '../store/game/gameConstants';

import Button from './Button';
import If from './If';

import Ingredient from './Ingredient';

class ProjectButton extends Component {

  onPress = () => {
    const { onPress, projectType } = this.props;

    this.props.actions.runProject(projectType);

    onPress && onPress();
  };

  render () {
    const {
      backgroundColor,
      eventStyle,
      projectType,
      resourceCounts,
      resourceProductions,
      showEvent,
      style
    } = this.props;

    const {
      canAfford,
      costs,
      event,
      isCapped,
      results
    } = getTransactionData(PROJECT_INFOS[projectType], resourceCounts, resourceProductions);

    const isDisabled = isCapped || !canAfford;

    return (
      <Button
        style={ style }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ this.onPress }
        useDebounce={ true }
      >
        <If condition={ showEvent }>
          <Text style={ [ styles.event, eventStyle ] }>{ event }</Text>
        </If>
        <View style={ styles.row }>
          { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost }/>) }
          <FontAwesome5 style={ styles.icon } name="arrow-right" />
          { results.map((result, index) => <Ingredient key={ index } ingredient={ result }/>) }
        </View>
      </Button>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  event: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '-0.1rem',
    marginBottom: '0.4rem',
  },

  icon: {
    fontSize: '1.4rem',
    color: '#FFFFFF',
    marginHorizontal: '0.3rem'
  },

  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.8rem',
    height: '1.8rem'
  },

  imageProduction: {
    width: '1.3rem',
    height: '1.3rem'
  },

  production: {
    backgroundColor: '#B37D43',
    borderColor: '#222222',
    borderWidth: 1,
    marginHorizontal: '0.2rem',
    padding: '0.2rem'
  },

  resource: {
    marginHorizontal: '0.2rem'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '0.4rem'
  },

  value: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { height: 0.1 },
    textShadowRadius: 2.5
  }

});

const mapStateToProps = (state) => {
  const { resourceCounts, resourceProductions } = state.game;

  return {
    resourceCounts,
    resourceProductions
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectButton);