import React from 'react';
import Shell from './components/Shell';


export default {
  Shell: Shell,

  toHtml(componentType, props = {}) {
    let component = React.createElement(componentType, props);
    return React.renderToString(component);
  }
};
