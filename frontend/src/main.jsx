import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Live from "./pages/Live.jsx";
import Settings from "./pages/Settings.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/live" element={<Live />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>
);
