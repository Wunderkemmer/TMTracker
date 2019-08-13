import moment from 'moment';

import React, { Component, Fragment } from 'react';

import { FlatList, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Ingredient from '../Ingredient';

import {
  RESOURCE_INFOS,
  TERRAFORMING_INFOS
} from '../../store/game/gameConstants';

class HistoryModal extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  static renderHistoryItem ({ item }) {
    const { transaction } = item;

    // const decrease = [ styles.text, styles.textDecrease ];
    // const increase = [ styles.text, styles.textIncrease ];

    const {
      event,

      countChanges,
      productionChanges,
      terraformingChanges
    } = transaction;

    const countEntries = countChanges ? Object.entries(countChanges) : [];
    const productionEntries = productionChanges ? Object.entries(productionChanges) : [];
    const terraformingEntries = terraformingChanges ? Object.entries(terraformingChanges) : [];
    const costInfos = [];
    const resultInfos = [];

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
        costInfos.push(info);
      } else {
        resultInfos.push(info);
      }
    }

    for (let [ key, value ] of productionEntries) {
      const image = RESOURCE_INFOS[key].image;
      const info = { image, isProduction: true, type: key, value };

      if (value < 0) {
        costInfos.push(info);
      } else {
        resultInfos.push(info);
      }
    }

    return (
      <Fragment>
        <Text style={ styles.event }>{ event }</Text>
        <View style={ styles.row }>
          { costInfos.map((costInfo, index) => <Ingredient key={ index } info={ costInfo }/>) }
        </View>
        <View style={ styles.row }>
          { resultInfos.map((resultInfo, index) => <Ingredient key={ index } info={ resultInfo }/>) }
        </View>
      </Fragment>
    );
  }

  render () {
    const { history } = this.props;
    const reverseHistory = [ ...history ].reverse();

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ reverseHistory }
        keyExtractor={ this.keyExtractor }
        renderItem={ HistoryModal.renderHistoryItem }
      />
    );
  }

}

const styles = ExtendedStyleSheet.create({

  container: {
    alignItems: 'stretch',
    paddingHorizontal: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '1rem'
  },

  event: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333333',
    marginTop: '-0.175rem'
  },

  row: {
    flexDirection: 'row'
  },

  textDecrease: {
    color: '#AA2222'
  },

  textIncrease: {
    color: '#22AA22'
  },

  textTime: {
    fontSize: '0.8rem',
    color: '#222222'
  }

});

const mapStateToProps = (state) => {
  const { ui } = state;

  return {
    future: ui.future,
    history: ui.history,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    /* ... */
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryModal);