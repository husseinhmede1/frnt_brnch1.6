import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Loader from './components/Loader';
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./feature/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>

  <React.StrictMode>
    <Router>
      <Loader />
      <App />
    </Router>
  </React.StrictMode>
      </Provider>

);
