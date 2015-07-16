import React from 'react';
import Page from './Page';
import Api from './Api';


export default {
  Page: Page,
  Api: Api,

  toHtml: (component, props = {}) => {
    let page = React.createFactory(Page);
    let child = React.createElement(component, props)
    let html = React.renderToStaticMarkup(page(props, child));
    return html;
  }
};
