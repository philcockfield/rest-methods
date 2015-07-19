import React from 'react';
import VerbBadges from './VerbBadges';


/**
 * The documentation for a single method.
 */
export default class Method extends React.Component {
  render() {
    let { name, method } = this.props;

    // Only provide a link if the method has a GET verb.
    let url = method.get
                ? <a href={ method.url } target='_blank'>{ method.url }</a>
                : method.url

    return (
      <div className='method'>
        <div className='content-outer'>
          <h1>{ name }</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          <VerbBadges method={ method }/>
          <pre>{ url }</pre>
        </div>
      </div>
    );
  }
}
