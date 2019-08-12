import React, { Component } from 'react';

import { Image, ImageBackground, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { runProject } from '../store/game/gameActions';

import {
  PROJECT_INFOS,
  RESOURCE_INFOS,
  RESOURCE_TYPES,
  TERRAFORMING_INFOS,
  TERRAFORMING_TYPES
} from '../store/game/gameConstants';

import Button from './Button';
import If from './If';

const { abs } = Math;

const Ingredient = (props) => {
  const { info } = props;
  const { image, isProduction, type, value } = info;

  if (type === RESOURCE_TYPES.TERRAFORMING_RATING) {
    return null;
  }

  const hideValue = type === TERRAFORMING_TYPES.TEMPERATURE;
  const absValue = hideValue ? 0 : abs(value);
  const displayValue = absValue > 1 ? absValue : null;

  const frameStyle = isProduction ? styles.production : styles.resource;
  const imageStyle = isProduction ? styles.imageProduction : styles.image;

  if (displayValue) {
    return (
      <View style={ frameStyle }>
        <ImageBackground style={ imageStyle } source={ image }>
          <Text style={ styles.value }>{ displayValue }</Text>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={ frameStyle }>
      <Image style={ imageStyle } source={ image } />
    </View>
  );
};

class ProjectButton extends Component {

  onPress = () => {
    const { onPress, projectType } = this.props;

    this.props.actions.runProject(projectType);

    onPress && onPress();
  };

  render () {
    const {
      backgroundColor,
      game,
      projectType,
      showTitle,
      style,
      titleStyle
    } = this.props;

    const info = PROJECT_INFOS[projectType];
    const { cap, countChanges, productionChanges, terraformingChanges, title } = info;
    const { resourceCounts, resourceProductions } = game;
    const countEntries = countChanges ? Object.entries(countChanges) : [];
    const productionEntries = productionChanges ? Object.entries(productionChanges) : [];
    const terraformingEntries = terraformingChanges ? Object.entries(terraformingChanges) : [];
    const isCapped = cap && TERRAFORMING_INFOS[cap].maximum && game[cap] >= TERRAFORMING_INFOS[cap].maximum;
    const costInfos = [];
    const resultInfos = [];

    let canAffordCounts = true;
    let canAffordProductions = true;

    for (let [ key, value ] of terraformingEntries) {
      const image = TERRAFORMING_INFOS[key].image;
      const info = { image, type: key, value };

      if (value < 0) {
        costInfos.push(info);
      } else {
        resultInfos.push(info);
      }
    }

    for (let [ key, value ] of countEntries) {
      const image = RESOURCE_INFOS[key].image;
      const info = { image, type: key, value };

      if (value < 0) {
        if (value + resourceCounts[key] < 0) {
          canAffordCounts = false;
        }

        costInfos.push(info);
      } else {
        resultInfos.push(info);
      }
    }

    for (let [ key, value ] of productionEntries) {
      const image = RESOURCE_INFOS[key].image;
      const info = { image, isProduction: true, type: key, value };

      if (value < 0) {
        if (value + resourceProductions[key] < RESOURCE_INFOS[key].minProduction) {
          canAffordProductions = false;
        }

        costInfos.push(info);
      } else {
        resultInfos.push(info);
      }
    }

    const isDisabled = isCapped || !canAffordCounts || !canAffordProductions;

    return (
      <Button
        style={ style }
        backgroundColor={ backgroundColor }
        isDisabled={ isDisabled }
        onPress={ this.onPress }
        useDebounce={ true }
      >
        <If condition={ showTitle }>
          <Text style={ [ styles.title, titleStyle ] }>{ title }</Text>
        </If>
        <View style={ styles.row }>
          { costInfos.map((costInfo, index) => <Ingredient key={ index } info={ costInfo }/>) }
          <FontAwesome5 style={ styles.icon } name="arrow-right" />
          { resultInfos.map((resultInfo, index) => <Ingredient key={ index } info={ resultInfo }/>) }
        </View>
      </Button>
    );
  }

}

const styles = ExtendedStyleSheet.create({

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

  title: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: '-0.1rem',
    marginBottom: '0.4rem',
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectButton);