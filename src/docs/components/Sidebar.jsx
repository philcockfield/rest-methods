import React from 'react';


/**
 * The sidebar index of the API docs.
 */
export default class Sidebar extends React.Component {
  render() {
    let { manifest } = this.props;
    let listItems = Object.keys(manifest.methods).map(key => {
        return <li key={key}>{ key }</li>
    });

    return (
      <div className='sidebar'>
        <div className='title-outer'>
          <h1>{ manifest.name }</h1>
          <span className='version'>{ manifest.version }</span>
        </div>

        <ul>
          { listItems }
        </ul>

      </div>
    );
  }
}
