import React, { Component } from 'react';

import { View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { runProject } from '../../store/game/gameActions';
import { PROJECT_TYPES } from '../../store/game/gameConstants';

import ProjectButton from '../ProjectButton';

class ProjectsModal extends Component {

  static publicStyles = ExtendedStyleSheet.create({
    popup: {
      maxHeight: '24rem'
    }
  });

  renderProjectButton = (projectType) => {
    return (
      <ProjectButton
        style={ styles.button }
        eventStyle={ styles.buttonText }
        onPress={ this.props.hide }
        projectType={ projectType }
        showEvent="true"
      />
    );
  };

  render () {
    return (
      <View style={ styles.container }>
        <View style={ styles.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.SELL_PATENT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_ASTEROID) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_GREENERY) }
        </View>
        <View style={ styles.buttonColumn }>
          { this.renderProjectButton(PROJECT_TYPES.BUY_POWER_PLANT) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_AQUIFER) }
          { this.renderProjectButton(PROJECT_TYPES.BUY_CITY) }
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  button: {
    flex: 1,
    margin: '0.2rem'
  },

  buttonColumn: {
    flex: 1
  },

  buttonText: {
    fontSize: '1rem',
    color: '#FFFFFF'
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '1rem'
  }

});

const mapStateToProps = (state) => {
  const { game } = state;

  return {
    game
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsModal);