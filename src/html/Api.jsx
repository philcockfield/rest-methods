import React from 'react';


/**
  * A visual representation of the API.
  */
export default class Api extends React.Component {
  render() {
    let { manifest } = this.props;
    let listItems = Object.keys(manifest.methods).map(key => {
        return <li>{ key }</li>
    });

    return (
      <div>
        <h1>{ manifest.name }</h1>
        <ul>{ listItems }</ul>
      </div>
    );
  }
}
