import React from 'react';


/**
  * A visual representation of the API.
  */
export default class Api extends React.Component {
  render() {
    let { manifest } = this.props;
    let listItems = Object.keys(manifest.methods).map(key => {
        return <li key={key}>{ key }</li>
    });

    return (
      <div>
        <h1>{ manifest.name }</h1>
        <ul>{ listItems }</ul>
        <code>Some code</code>
      </div>
    );
  }
}
