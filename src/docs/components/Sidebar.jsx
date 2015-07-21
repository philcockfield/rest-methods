import React from 'react';
import Header from './Header';
import SidebarList from './SidebarList';


/**
 * The sidebar index of the API docs.
 */
export default class Sidebar extends React.Component {
  render() {
    let { manifest } = this.props;
    let methodItems = Object.keys(manifest.methods).map(key => {
          let method = manifest.methods[key];
          return {
            label: method.name,
            url: `${ manifest.basePath }/#${ key }`
          };
    });

    return (
      <div className='sidebar'>
        <Header manifest={ manifest }/>
        <SidebarList title='API' items={ methodItems }/>
      </div>
    );
  }
}
