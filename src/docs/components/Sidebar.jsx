import React from 'react';
import Header from './Header';



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
        <Header manifest={manifest}/>
        <ul>
          { listItems }
        </ul>
      </div>
    );
  }
}
