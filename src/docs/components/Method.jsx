import _ from "lodash";
import React from "react";
import VerbTabs from "./VerbTabs";
import Arguments from "./Arguments";
import Markdown from "./Markdown";


/**
 * The documentation for a single method.
 */
export default class Method extends React.Component {
  constructor(props) {
    super(props);
    let { method } = this.props;
    let verb = _.find(["get", "post", "put", "delete"], (item) => { return method[item] !== undefined; });
    this.state = { selectedVerb: verb };
  }


  handleVerbChanged(e) {
    this.setState({ selectedVerb: e.verb });
  }


  render() {
    let { selectedVerb } = this.state;
    let { method } = this.props;
    let name = method.name;
    let params = method[selectedVerb].params;

    // Only provide a link if the method has a GET verb.
    let url = method.get
                ? <a href={ method.url } target="_blank">{ method.url }</a>
                : method.url;

    let description = method.description
                ? <p><Markdown>{ method.description }</Markdown></p>
                : null;


    let codeSample = "";
    if (params) { codeSample = params.map(item => { return item.name; }).join(", "); }
    codeSample = `server.methods.${ name }.${ selectedVerb }(${ codeSample });`;


    return (
      <div className="method">
        <div className="content-outer">
          <a name={ name } id={ name } className="section-anchor">
            <h1>{ method.name }</h1>
          </a>
          { description }

          <VerbTabs
              method={ method }
              selectedVerb={ selectedVerb }
              onChanged={ this.handleVerbChanged.bind(this) }/>

          <pre>{ selectedVerb.toUpperCase() }: { url }</pre>
          <pre>{ codeSample }</pre>

          { params ? <Arguments method={method} params={params}/> : null }
        </div>
      </div>

    );
  }
}
