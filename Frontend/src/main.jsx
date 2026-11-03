import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Ensure data-theme is synchronized on documentElement before hydration
try {
  const saved = localStorage.getItem("clingene-theme");
  const theme = saved === "red" || saved === "green" || saved === "cyan" ? saved : (saved === "blue" ? "cyan" : "cyan");
  document.documentElement.setAttribute("data-theme", theme);
} catch (_) {}

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
