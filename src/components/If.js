import React, { Fragment, Component } from 'react';

export default class If extends Component {

  render () {
    return this.props.condition ?
      <Fragment>{ this.props.children }</Fragment> :
      null;
  }

}
