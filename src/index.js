import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/fonts/iconfont.css";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <Router>
  //     <App />
  //   </Router>
  // </React.StrictMode>
  <Router>
    <App />
  </Router>
);

// export { default as KeepAlive } from "./componments/KeepAlive";
