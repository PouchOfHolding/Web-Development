import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Elemento com ID "root" não encontrado no index.html.');
}

ReactDOM.createRoot(rootElement).render( //liga o React ao root do HTML
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);
//.render(<App />) diz qual é a componente raízs