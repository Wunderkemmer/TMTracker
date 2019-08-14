import React, { Component, Fragment } from 'react';

import { FlatList, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getTransactionData } from '../../lib/utils';

import Ingredient from '../Ingredient';

class HistoryModal extends Component {

  keyExtractor = (item, index) => `${ item.event }.${ index }`;

  renderHistoryItem = ({ item }) => {
    const { resourceCounts, resourceProductions } = this.props;

    const {
      costs,
      event,
      results,
    } = getTransactionData(item.transaction, resourceCounts, resourceProductions, true);

    return (
      <Fragment>
        <Text style={ styles.event }>{ event }</Text>
        <View style={ styles.row }>
          { costs.map((cost, index) => <Ingredient key={ index } ingredient={ cost } isVerbose="true" />) }
        </View>
        <View style={ styles.row }>
          { results.map((result, index) => <Ingredient key={ index } ingredient={ result } isVerbose="true" />) }
        </View>
      </Fragment>
    );
  };

  render () {
    const { history } = this.props;
    const reverseHistory = [ ...history ].reverse();

    return (
      <FlatList
        contentContainerStyle={ styles.container }
        data={ reverseHistory }
        keyExtractor={ this.keyExtractor }
        renderItem={ this.renderHistoryItem }
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
  const { game, ui } = state;
  const { resourceCounts, resourceProductions } = game;
  const { future, history } = ui;

  return {
    future,
    history,
    resourceCounts,
    resourceProductions
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    /* ... */
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryModal);