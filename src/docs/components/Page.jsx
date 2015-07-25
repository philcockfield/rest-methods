import React from "react";


/**
 * The root <html> page.
 */
export default class Page extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>{ this.props.title }</title>
          <meta charSet='utf-8'/>
          <link href={ this.props.stylePath } rel='stylesheet'/>
          <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700,300italic,400italic' rel='stylesheet' type='text/css'/>
        </head>
        <body>
          <div
            id='page-root'
            dangerouslySetInnerHTML={{ __html: this.props.bodyHtml }}/>
        </body>
        <script id='script' type='text/javascript' src={ this.props.scriptPath }></script>
      </html>
    );
  }
}
