import React, { Component } from 'react';

import { Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import Button from '../Button';

import { TRACKER_INFOS, TRACKER_TYPES } from '../Tracker';

const popupManagers = [];
const popupStates = {};

function addPopupManager (component) {
  if (popupManagers.indexOf(component) === -1) {
    popupManagers.push(component);
  }
}

function removePopupManager (component) {
  const index = popupManagers.indexOf(component);

  if (index !== -1) {
    popupManagers.splice(index, 1);
  }
}

export function showPopup (id, props) {
  popupStates[id] = { ...props, show: true, dismiss: () => hidePopup(id) };

  popupManagers.forEach((manager) => manager.onShowPopup(id, props));
}

export function hidePopup (id) {
  popupStates[id] = null;

  popupManagers.forEach((manager) => manager.onHidePopup(id));
}

const fakeDismissForHiding = () => {
  // Do nothing!
};

export class Popups extends Component {

  componentDidMount () {
    addPopupManager(this);
  }

  componentWillUnmount () {
    removePopupManager(this);
  }

  onShowPopup (/* id, props */) {
    this.forceUpdate();
  }

  onHidePopup (/* id */) {
    this.forceUpdate();
  }

  render () {
    return React.Children.map(
      this.props.children,
      (child) => React.cloneElement(child, popupStates[child.props.id] || {
        show: false,
        dismiss: fakeDismissForHiding
      })
    );
  }

}

export class Popup extends Component {

  slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });

  renderIcon = () => {
    const { type } = this.props;

    if (type) {
      const trackerInfo = TRACKER_INFOS[type];
      const icon = trackerInfo.icon;

      if (icon) {
        return (
          <Image style={ styles.headerIcon } resizeMode="contain" source={ icon } />
        );
      }
    }

    return null;
  };

  renderTitle = () => {
    const { type } = this.props;

    if (type) {
      const trackerInfo = TRACKER_INFOS[type];
      const { title } = trackerInfo;

      return (
        <Text style={ styles.headerText }>{ title } Calculator</Text>
      );
    }

    return null;
  };

  render () {
    const { component, id, style, show, type } = this.props;

    const headerStyle = { backgroundColor: type ? TRACKER_INFOS[type].color : '#FFEEDD' };

    return (
      <PopupDialog
        visible={ show }
        dialogStyle={ [ styles.defaultPopup, style ] }
        dialogAnimation={ this.slideAnimation }
        onTouchOutside={ () => hidePopup(id) }
      >
        <View style={ styles.border }>
          <View style={ styles.container }>
            <View style={ [ styles.header, headerStyle ] }>
              { this.renderIcon() }
              { this.renderTitle() }
            </View>
            { React.createElement(component, this.props) }
          </View>
        </View>
      </PopupDialog>
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

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.7rem',
    height: '100%'
  },

  defaultPopup: {
    backgroundColor: 'transparent',
    minWidth: '50%',
    height: '86%',
    padding: '0rem'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '2.5rem',
    paddingHorizontal: '0.45rem'
  },

  headerIcon: {
    flex: 1,
    height: '1.6rem',
    marginRight: '0.2rem'
  },

  headerText: {
    flex: 4,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0.2rem'
  }

});
