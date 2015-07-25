import React from "react";
import _ from "lodash";



/**
 * A single tab button.
 */
export class VerbTab extends React.Component {
  handleClick() {
    const handler = this.props.onClick;
    if (handler) { handler({ verb: this.props.verb }); }
  }

  render() {
    let className = "verb-tab";
    if (this.props.isSelected) { className += " is-selected"; }
    return (
      <div className={ className } onClick={ this.handleClick.bind(this) }>
        { this.props.verb.toUpperCase() }
      </div>
    );
  }
}



/**
 * A horizontal list of GET|POST|PUT|DELETE display badges
 */
export default class VerbTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedVerb: (props.selectedVerb || "get") };
  }

  handleTabClick(e) {
    this.setState({ selectedVerb: e.verb });
    const handler = this.props.onChanged;
    if (_.isFunction(handler)) { handler(e); }
  }

  render() {
    let { method } = this.props;
    let selectedVerb = this.state.selectedVerb;

    let verbs = ["get", "post", "put", "delete"].map((verb, i) => {
        if (method[verb]) {
          let isSelected = verb === selectedVerb;
          return <VerbTab
                    key={ i + verb }
                    verb={ verb }
                    isSelected={ isSelected }
                    onClick={ this.handleTabClick.bind(this) }/>;
        }
    });

    return (
      <div className="verb-tabs">
        <div className="tabs-outer">{ _.compact(verbs) }</div>
      </div>
    );
  }
}
