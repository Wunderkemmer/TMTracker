import React, { Component } from 'react';

import { Image, Text, View } from 'react-native';

import ExtendedStyleSheet from 'react-native-extended-stylesheet';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import Button from '../Button';
import { TRACKER_INFOS } from '../Tracker';

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
  if (popupStates[id]) {
    popupStates[id].show = false;
  }

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
        dismiss: fakeDismissForHiding,
      })
    );
  }

}

export class Popup extends Component {

  slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });

  renderImage = () => {
    const { type } = this.props;

    if (type) {
      const trackerInfo = TRACKER_INFOS[type];
      const image = trackerInfo.image;

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

    const displayTitle = type ? 'Adjust ' + TRACKER_INFOS[type].title : title;

    if (displayTitle) {
      return (
        <Text style={ styles.headerText }>{ displayTitle }</Text>
      );
    }

    return null;
  };

  render () {
    const { component, id, style, show, type } = this.props;

    const headerStyle = { backgroundColor: type ? TRACKER_INFOS[type].color : '#5B8BDD' };

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
              { this.renderImage() }
              { this.renderTitle() }
              <View style={ styles.filler } />
              <Button
                style={ styles.button }
                backgroundColor="#FF0000"
                color="#FFFFFF"
                icon="times"
                onPress={ this.props.dismiss }
              />
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

  button: {
    borderRadius: '0.5rem',
    maxWidth: '2.1rem',
    height: '2.1rem'
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: '0.7rem',
    borderTopLeftRadius: '0.7rem',
    height: '3rem',
    paddingHorizontal: '0.45rem'
  },

  headerImage: {
    width: '2rem',
    height: '2rem'
  },

  headerText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0.2rem',
    paddingLeft: '0.25rem'
  }

});
