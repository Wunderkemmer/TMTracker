import React, { Component } from 'react';

import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ImageIconOcean from '../../resources/images/icon_ocean.png';
import ImageIconOxygen from '../../resources/images/icon_oxygen.png';
import ImageIconTemperature from '../../resources/images/icon_temperature.png';

import Button from '../components/Button';

import { runProject } from '../store/game/gameActions';
import { PROJECT_TYPES, RESOURCE_INFOS, RESOURCE_TYPES } from '../store/game/gameConstants';
import GameState from '../store/game/gameState';
import { redo, showModal, startGame, undo } from '../store/ui/uiActions';
import { MODAL_TYPES } from '../store/ui/uiConstants';

import ProjectButton from './ProjectButton';
import Tracker from './Tracker';

const StyledTracker = (props) => {
  const { type } = props;

  let style;

  switch (type) {
    case RESOURCE_TYPES.TERRAFORMING_RATING:
    case RESOURCE_TYPES.GENERATION:
      style = styles.trackerTiny;

      break;

    default:
      style = styles.tracker;
  }

  return (
    <Tracker key={ type } style={ style } type={ type } />
  );
};

class Interface extends Component {

  onNewGame = () => {
    Alert.alert(
      'Do you really want to start a new game?',
      null,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.actions.startGame(new GameState()) }
      ],
      'default'
    );
  };

  onOcean = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_OCEAN);
  };

  onOxygen = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_OXYGEN);
  };

  onTemperature = () => {
    this.props.actions.runProject(PROJECT_TYPES.ADD_TEMPERATURE);
  };

  render () {
    const {
      isRedoDisabled,
      isUndoDisabled,
      oceans,
      oxygen,
      temperature
    } = this.props;

    const { redo, showModal, undo } = this.props.actions;

    const capOceans = oceans >= RESOURCE_INFOS[RESOURCE_TYPES.OCEANS].maximumCount;
    const capOxygen = oxygen >= RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN].maximumCount;
    const capTemperature = temperature >= RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximumCount;

    const oceanTextStyle = capOceans ?
      styles.toggleBottomTextComplete :
      styles.toggleBottomText;

    const oxygenTextStyle = capOxygen ?
      styles.toggleBottomTextComplete :
      styles.toggleBottomText;

    const temperatureTextStyle = capTemperature ?
      styles.toggleTopTextComplete :
      styles.toggleTopText;

    const oxygenText = oxygen + '%';
    const temperatureText = (temperature > 0 ? '+' + temperature : temperature) + '°';

    return (
      <View style={ styles.container }>
        <View style={ styles.sidebar }>
          <View style={ styles.sidebarTracker }>
            <StyledTracker type={ RESOURCE_TYPES.TERRAFORMING_RATING } />
          </View>
          <View style={ styles.sidebarButtonsLeft }>
            <View style={ styles.sidebarButtonRow }>
              <Button
                style={ styles.button }
                icon="undo-alt"
                isDisabled={ isUndoDisabled }
                onPress={ undo }
              />
              <Button
                style={ styles.button }
                icon="redo-alt"
                isDisabled={ isRedoDisabled }
                onPress={ redo }
              />
            </View>
            <View style={ styles.sidebarButtonRow }>
              <Button
                style={ styles.button }
                icon="info-circle"
                onPress={ () => showModal(MODAL_TYPES.INFO) }
              />
              <Button
                style={ styles.button }
                icon="file"
                onPress={ this.onNewGame }
              />
            </View>
            <View style={ styles.flex } />
            <View style={ styles.sidebarToggleRow }>
              <View style={ styles.sidebarToggleColumn }>
                <TouchableOpacity onPress={ this.onOcean } disabled={ capOceans }>
                  <Image style={ styles.toggleOcean } source={ ImageIconOcean } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.onOcean } disabled={ capOceans }>
                  <Text style={ oceanTextStyle }>{ oceans }</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.sidebarToggleColumn }>
                <TouchableOpacity onPress={ this.onTemperature } disabled={ capTemperature }>
                  <Text style={ temperatureTextStyle }>{ temperatureText }</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.onTemperature } disabled={ capTemperature }>
                  <Image style={ styles.toggleTemperature } source={ ImageIconTemperature } />
                </TouchableOpacity>
              </View>
              <View style={ styles.sidebarToggleColumn }>
                <TouchableOpacity onPress={ this.onOxygen } disabled={ capOxygen }>
                  <Image style={ styles.toggleOxygen } source={ ImageIconOxygen } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.onOxygen } disabled={ capOxygen }>
                  <Text style={ oxygenTextStyle }>{ oxygenText }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={ styles.resources }>
          <View style={ styles.resourcesRow }>
            <StyledTracker type={ RESOURCE_TYPES.MEGACREDITS } />
            <StyledTracker type={ RESOURCE_TYPES.STEEL } />
            <StyledTracker type={ RESOURCE_TYPES.TITANIUM } />
          </View>
          <View style={ styles.resourcesRow }>
            <StyledTracker type={ RESOURCE_TYPES.PLANTS } />
            <StyledTracker type={ RESOURCE_TYPES.ENERGY } />
            <StyledTracker type={ RESOURCE_TYPES.HEAT } />
          </View>
        </View>
        <View style={ styles.sidebar }>
          <View style={ styles.sidebarTracker }>
            <StyledTracker type={ RESOURCE_TYPES.GENERATION } />
          </View>
          <View style={ styles.sidebarButtonsRight }>
            <ProjectButton
              style={ styles.button }
              backgroundColor="#5FB365"
              projectType={ PROJECT_TYPES.TRADE_PLANTS }
            />
            <ProjectButton
              style={ styles.button }
              backgroundColor="#ED4E44"
              projectType={ PROJECT_TYPES.TRADE_HEAT }
            />
            <Button
              style={ styles.button }
              text="Projects"
              onPress={ () => showModal(MODAL_TYPES.PROJECTS) }
            />
          </View>
        </View>
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  button: {
    maxHeight: '2.6rem',
    minHeight: '2.6rem',
    margin: '0.2rem'
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: '0.25rem'
  },

  flex: {
    flex: 1
  },

  resources: {
    flex: 4,
    paddingVertical: '0.25rem'
  },

  resourcesRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  sidebar: {
    flex: 1,
    paddingVertical: '0.25rem'
  },

  sidebarButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  sidebarButtonsLeft: {
    flex: 1
  },

  sidebarButtonsRight: {
    flex: 1
  },

  sidebarToggleColumn: {
    alignItems: 'center'
  },

  sidebarToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '0.2rem',
    marginBottom: '0.25rem',
    marginHorizontal: '0.35rem'
  },

  sidebarTracker: {
    flex: 1,
    maxHeight: '10rem'
  },

  toggleOcean: {
    width: '2.35rem',
    height: '2.35rem',
    marginTop: '1rem'
  },

  toggleOxygen: {
    width: '2.35rem',
    height: '2.35rem',
    marginTop: '1rem'
  },

  toggleTemperature: {
    width: '1.5rem',
    height: '3rem',
    marginTop: '0.4rem'
  },

  toggleTopText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginHorizontal: '-1rem'
  },

  toggleTopTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginHorizontal: '-1rem'
  },

  toggleBottomText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '0.4rem'
  },

  toggleBottomTextComplete: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00FF00',
    marginTop: '0.4rem'
  },

  tracker: {
    margin: '0.2rem'
  },

  trackerTiny: {
    flex: 1,
    margin: '0.2rem'
  }

});

const mapStateToProps = (state) => {
  const { future, history } = state.ui;
  const { oceans, oxygen, temperature } = state.game.resourceCounts;

  return {
    isRedoDisabled: future.size < 1,
    isUndoDisabled: history.size < 2,
    oceans,
    oxygen,
    temperature
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    runProject,
    redo,
    showModal,
    startGame,
    undo
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Interface);