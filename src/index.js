import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { Provider } from "react-redux";
import store from "./store";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
