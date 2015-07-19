import React from 'react';


/**
  * The top-level header bar.
  */
export default class Header extends React.Component {
  render() {
    let { manifest } = this.props;

    return (
      <div className='header'>
        <h1>{ manifest.name }</h1>
        <span className='version'>{ manifest.version }</span>
      </div>
    );
  }
}
