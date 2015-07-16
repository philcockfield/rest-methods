import React from 'react';


/**
 * A root HTML page.
 */
export default class Page extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>{ this.props.pageTitle }</title>
          <meta charSet='utf-8'/>
        </head>
        <body>
          { this.props.children }
        </body>
      </html>
    );
  }
}
