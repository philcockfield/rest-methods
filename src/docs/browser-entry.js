import React from "react";
import { Shell } from "./index";


// Render the live React components over the
// statically server-rendered HTML.
let script = document.getElementById("manifestJson");
let manifest = JSON.parse(script.dataset.manifest);

React.render(
  React.createElement(Shell, { manifest: manifest }),
  document.getElementById("page-root")
);


// TEMP - TEST CODE
// ----------------------------------------------------------------------------
// import rest from "../../browser";
// let server = rest();
// server.onReady(() => {
//
//     console.log("server", server);
//     server.methods.foo.bar.put("my-id", "lorem").then((result) => {
//       console.log("result", result);
//     });
//
//     server.methods.bar.get("my-foo-get", 5).then((result) => {
//       console.log("result", result);
//     });
//
// });
