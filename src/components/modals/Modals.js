import React, { Component } from 'react';

import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RESOURCE_INFOS } from '../../store/game/gameConstants';
import { hideModal } from '../../store/ui/uiActions';

import Button from '../Button';

class Modal extends Component {

  renderImage = () => {
    const { type } = this.props;

    if (type) {
      const { image } = RESOURCE_INFOS[type];

      if (image) {
        return (
          <Image style={ styles.headerImage } resizeMode="contain" source={ image } />
        );
      }
    }

    return null;
  };

  renderTitle = () => {
    const { type, title } = this.props;

    const displayTitle = type ? 'Update ' + RESOURCE_INFOS[type].title : title;

    if (displayTitle) {
      return (
        <Text style={ styles.headerText }>{ displayTitle }</Text>
      );
    }

    return null;
  };

  render () {
    const { content, hide, type } = this.props;

    const modalStyle = content.publicStyles ? content.publicStyles.popup : null;
    const headerStyle = { backgroundColor: type ? RESOURCE_INFOS[type].color : '#5B8BDD' };

    return (
      <View style={ styles.modal }>
        <TouchableWithoutFeedback onPress={ hide }>
          <View style={ styles.overlay } />
        </TouchableWithoutFeedback>
        <View style={ [ styles.defaultPopup, modalStyle ] }>
          <View style={ styles.border }>
            <View style={ styles.container }>
              <View style={ [ styles.header, headerStyle ] }>
                { this.renderImage() }
                { this.renderTitle() }
                <View style={ styles.filler } />
                <Button
                  style={ styles.button }
                  backgroundColor="#FF0000"
                  color="#FFFFFF"
                  icon="times"
                  hideShadow={ true }
                  onPress={ hide }
                />
              </View>
              { React.createElement(content, this.props) }
            </View>
          </View>
        </View>
      </View>
    );
  }

}

class Modals extends Component {

  hideModal (props) {
    const { id, onHide } = props;

    this.props.actions.hideModal(id);

    onHide && onHide();
  }

  render () {
    const { modals } = this.props;

    return (
      <View style={ styles.modals } pointerEvents="box-none">
        {
          modals.map((props, index) => (
            <Modal key={ index } { ...props } hide={ () => this.hideModal(props) } />
          ))
        }
      </View>
    );
  }

}

const styles = ExtendedStyleSheet.create({

  border: {
    backgroundColor: '#222222',
    borderRadius: '0.8rem',
    margin: '0.2rem',
    padding: '0.15rem',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.5
  },

  button: {
    borderRadius: '0.5rem',
    maxWidth: '2.3rem',
    height: '2.3rem'
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.7rem',
    height: '100%'
  },

  defaultPopup: {
    backgroundColor: 'transparent',
    minWidth: '50%',
    height: '95%',
    margin: '0.2rem',
    padding: '0rem',
    paddingBottom: '0.75rem'
  },

  filler: {
    flex: 1
  },

  frame: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    width: '85%',
    borderRadius: '1rem'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '3.2rem',
    paddingHorizontal: '0.45rem'
  },

  headerImage: {
    width: '2.2rem',
    height: '2.2rem'
  },

  headerText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0.2rem',
    paddingLeft: '0.35rem'
  },

  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  modals: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

});

const mapStateToProps = (state) => {
  const { modals } = state.ui;

  return {
    modals
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    hideModal
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Modals);