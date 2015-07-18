import React from 'react';
import Page from './components/Page';
import Shell from './components/Shell';


export default {
  Page: Page,
  Shell: Shell,

  toHtml: (component, props = {}) => {
    let page = React.createFactory(Page);
    let child = React.createElement(component, props)
    let html = React.renderToStaticMarkup(page(props, child));
    return html;
  }
};
