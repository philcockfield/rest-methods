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
          <link href={ `${ this.props.basePath }/style.css` } rel='stylesheet'/>
          <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700,300italic,400italic' rel='stylesheet' type='text/css'/>
        </head>
        <body>
          { this.props.children }
        </body>
      </html>
    );
  }
}
