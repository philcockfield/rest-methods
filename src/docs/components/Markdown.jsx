import _ from "lodash";
import React from "react";
import marked from "marked";


/**
 * Renders content as formatted markdown HTML.
 */
export default class Markdown extends React.Component {
  render() {
    if (_.isString(this.props.children)) {
      var html = marked(this.props.children);
    }
    return html
        ? <span className="markdown" dangerouslySetInnerHTML={{ __html: html }}/>
        : this.props.children;
  }
}
