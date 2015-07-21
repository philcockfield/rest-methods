import _ from 'lodash';
import React from 'react';
import VerbTabs from './VerbTabs';
import Arguments from './Arguments';
import Markdown from './Markdown';


/**
 * The documentation for a single method.
 */
export default class Method extends React.Component {
  render() {
    let { name, method } = this.props;
    let params;
    _.forIn(method, (value, key) => { if (value.params) { params = value.params; }});

    // Only provide a link if the method has a GET verb.
    let url = method.get
                ? <a href={ method.url } target='_blank'>{ method.url }</a>
                : method.url

    let description = method.description
                ? <p><Markdown>{ method.description }</Markdown></p>
                : null

    return (
      <div className='method'>
        <div className='content-outer'>
          <a name={ name } id={ name } className='section-anchor'>
            <h1>{ name }</h1>
          </a>
          { description }
          <VerbTabs method={ method }/>
          <pre>{ url }</pre>
          <pre>server.methods.{ name }.get()</pre>
          { params ? <Arguments method={method} params={params}/> : null }
        </div>
      </div>

    );
  }
}
