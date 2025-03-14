// Import polyfills before other code
import "./polyfills";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import WalletContextProvider from "./components/WalletContextProvider";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
