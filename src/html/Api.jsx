import React from 'react';


/**
  * A visual representation of the API.
  */
export default class Api extends React.Component {
  render() {

    let { manifest } = this.props;
    console.log('manifest', manifest);

    return (
      <div>API Manifest: { this.props.pageTitle }</div>
    );
  }
}
