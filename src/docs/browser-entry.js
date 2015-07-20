import React from 'react';
import { Shell } from './index';

// Render the live React components over the
// statically server-rendered HTML.
let script = document.getElementById('script');
let manifest = JSON.parse(script.dataset.manifest);

React.render(
  React.createElement(Shell, { manifest:manifest }),
  document.getElementById('page-root')
);
