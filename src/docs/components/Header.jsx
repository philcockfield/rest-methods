import React from "react";
import { MANIFEST_PATH } from "../../const";


/**
 * The top-level header bar.
 */
export default class Header extends React.Component {
  render() {
    let { manifest } = this.props;

    return (
      <div className="header">
        <h1>{ manifest.name }</h1>
        <a
          href={ MANIFEST_PATH + '?docs=true' }
          className="version"
          target="_blank">
            { manifest.version }
        </a>
      </div>
    );
  }
}
