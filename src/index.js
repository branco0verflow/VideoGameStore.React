// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { UsuarioProvider } from "./Componentes/UsuarioContext/UsuarioContext";
import { SocioProvider } from "./Componentes/socioContext/socioContext";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SocioProvider>
      <UsuarioProvider>

        <App />

      </UsuarioProvider>
    </SocioProvider>
  </React.StrictMode>
);
reportWebVitals();
