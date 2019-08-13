import AsyncStorage from '@react-native-community/async-storage';

import React, { Component } from 'react';

import { Alert, Dimensions, Image, SafeAreaView, Text } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-splash-screen';

import { Provider } from 'react-redux';

import ImageMars from './resources/images/background_mars.jpg';

import Interface from './src/components/Interface';
import Modals from './src/components/modals/Modals';

import store from './src/store';

import { RESOURCE_INFOS, RESOURCE_TYPES } from './src/store/game/gameConstants';
import GameState from './src/store/game/gameState';
import { setHistory, startGame } from './src/store/ui/uiActions';

const { width } = Dimensions.get('window');

ExtendedStyleSheet.build({
  $rem: width * 0.02
});

Text.defaultProps = Text.defaultProps || {};

Text.defaultProps.allowFontScaling = false;

type Props = {};

export default class App extends Component<Props> {

  state = {
    isLoading: true
  };

  componentDidMount () {
    AsyncStorage.getItem('gameHistory').then((history) => {
      if (history) {
        history = JSON.parse(history);

        const { event, gameState } = history[history.length - 1];
        const { oceanCount, oxygenLevel, temperature } = gameState.resourceCounts;

        const isGameInProgress = event !== 'newGame' &&
          (oceanCount < RESOURCE_INFOS[RESOURCE_TYPES.OCEAN_COUNT].maximum ||
           oxygenLevel < RESOURCE_INFOS[RESOURCE_TYPES.OXYGEN_LEVEL].maximum ||
           temperature < RESOURCE_INFOS[RESOURCE_TYPES.TEMPERATURE].maximum);

        if (isGameInProgress) {
          SplashScreen.hide();

          Alert.alert(
            'An in-progress game was found, do you want to restore it?',
            null,
            [
              { text: 'No', style: 'cancel', onPress: this.onStartGame },
              { text: 'Yes', onPress: () => this.onSetHistory(history) }
            ],
            'default'
          );

          return;
        }
      }

      SplashScreen.hide();

      this.onStartGame();
    });
  }

  onSetHistory = (history) => {
    store.dispatch(setHistory(history));

    this.setState({ isLoading: false });
  };

  onStartGame = () => {
    store.dispatch(startGame(new GameState()));

    this.setState({ isLoading: false });
  };

  render () {
    if (this.state.isLoading) {
      return (
        <Image style={ styles.container } resizeMode="cover" source={ ImageMars } />
      );
    }

    return (
      <Provider store={ store }>
        <Image style={ styles.container } resizeMode="cover" source={ ImageMars } />
        <SafeAreaView style={ styles.safeAreaView }>
          <Interface />
          <Modals />
        </SafeAreaView>
      </Provider>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%'
  },

  safeAreaView: {
    flex: 1
  }

});
