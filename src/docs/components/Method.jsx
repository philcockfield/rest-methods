import React from 'react';
import VerbBadges from './VerbBadges';


/**
 * The documentation for a single method.
 */
export default class Method extends React.Component {
  render() {
    let { name, method } = this.props;

    return (
      <div className='method'>
        <div className='content-outer'>

          <h1>{ name }</h1>
          <VerbBadges method={ method }/>

          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>

          <pre>
            { method.url }
          </pre>

        </div>
      </div>
    );
  }
}
