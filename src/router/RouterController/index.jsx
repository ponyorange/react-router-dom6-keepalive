import React, {Component} from 'react';
import {Outlet} from 'react-router-dom'

class RouterController extends Component {
  render() {
    return (
      <>
        <Outlet />
      </>
    );
  }
}

export default RouterController;
