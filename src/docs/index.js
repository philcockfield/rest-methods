import React from "react";
import Shell from "./components/Shell";
import Page from "./components/Page";


export default {
  Shell: Shell,

  pageHtml(props = {}) {
    const htmlComponent = React.createFactory(Page);
    return React.renderToStaticMarkup(htmlComponent(props));
  },

  toHtml(componentType, props = {}) {
    let component = React.createElement(componentType, props);
    return React.renderToString(component);
  }
};
