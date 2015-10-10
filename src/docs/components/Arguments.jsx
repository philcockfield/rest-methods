import React from "react";
import Markdown from "./Markdown";


/**
 * The parameters arguments for a method.
 */
export default class Arguments extends React.Component {
  render() {
    let { method, params } = this.props;
    let result = <div/>; // Empty (no params).

    if (params) {
      let rows = params.map((param, i) => { return <ArgumentRow key={i} {...param}/>; });
      result = (
        <div className="arguments">
          <div className="title">{ this.props.title }</div>
          <table>
            <tbody>{ rows }</tbody>
          </table>
        </div>
      );
    }
    return result;
  }
}
Arguments.defaultProps = { title: "Arguments" };



/**
 * A single argument list item
 */
class ArgumentRow extends React.Component {
  render() {
    let { name, type, description } = this.props;

    return (
      <tr className="argument-row">
        <td className="label-outer">
          <div className="name">{ name }</div>
          { type ? <div className="details">{ type }</div> : null }
        </td>
        <td className="value-outer">
          { description
              ? <Markdown>{ description }</Markdown>
            : <span className="no-description">—</span>
          }
        </td>
      </tr>
    );
  }
}
