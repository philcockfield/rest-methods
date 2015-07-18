import React from 'react';
import Sidebar from './Sidebar';


/**
  * A visual representation of the API.
  */
export default class Api extends React.Component {
  render() {
    let { manifest } = this.props;

    return (
      <div className='root'>
        <div className='sidebar-outer'>
          <Sidebar manifest={ manifest }/>
        </div>
        <div className='main-outer'>
          <div className='main-centered'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    );
  }
}
