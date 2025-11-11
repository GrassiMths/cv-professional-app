import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./ThemeContext";
import "./index.css";

// Integração com Electron
const initializeApp = () => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
};

// Aguardar um pouco para mostrar loading
setTimeout(initializeApp, 500);
