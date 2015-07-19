import React from 'react';


/**
 * A horizontal list of GET|POST|PUT|DELETE display badges
 */
export default class VerbBadges extends React.Component {
  render() {
    let { method } = this.props;
    let verbs = ['get', 'post', 'put', 'delete'].map(verb => {
        let className = 'verb';
        if (method[verb]) { className += ' is-supported'; }
        return <div key={ verb } className={ className }>
                 { verb.toUpperCase() }
               </div>
    });

    return (
      <div className='verb-badges'>{ verbs }</div>
    );
  }
}
