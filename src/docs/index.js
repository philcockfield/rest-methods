import React from 'react';
import Shell from './components/Shell';


export default {
  Shell: Shell,

  pageHtml(props = {}) {
    // renderToStaticMarkup

    var htmlComponent = React.createFactory(require("./components/Page"));

    // props
    // markup: React.renderToString(bodyElement)

    var html = React.renderToStaticMarkup(htmlComponent(props));
    return html;

  },

  toHtml(componentType, props = {}) {
    let component = React.createElement(componentType, props);
    return React.renderToString(component);
  }
};
