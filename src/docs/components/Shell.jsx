import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Method from './Method';


/**
 * A visual representation of the API.
 */
export default class Shell extends React.Component {
  render() {
    let { manifest } = this.props;
    let methodItems = Object.keys(manifest.methods).map((key, i) => {
        let value = manifest.methods[key];
        return <li key={i}>
                 <Method method={ value }/>
               </li>
    });

    return (
      <div className='shell'>
        {/* NOTE: Header is hidden unless the screen is so narrow that the sidebar is hidden */}
        <Header manifest={ manifest }/>
        <Sidebar manifest={ manifest }/>
        <ul className='main-outer'>{ methodItems }</ul>
      </div>
    );
  }
}
