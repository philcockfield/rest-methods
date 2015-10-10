import React from "react";
import ReactDOMServer from "react-dom/server";
import Shell from "./components/Shell";
import Page from "./components/Page";



export default {
  Shell: Shell,

  pageHtml(props = {}) {
    const htmlComponent = React.createFactory(Page);
    return ReactDOMServer.renderToStaticMarkup(htmlComponent(props));
  },

  toHtml(componentType, props = {}) {
    let component = React.createElement(componentType, props);
    return ReactDOMServer.renderToString(component);
  }
};
