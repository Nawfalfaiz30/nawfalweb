import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Elemen #root tidak ditemukan.");
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
