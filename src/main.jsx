import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { AppStateProvider } from "./context/AppStateProvider";
import { AuthProvider } from "./context/AuthProvider";
import AuthGate from "./components/AuthGate";

function renderFatal(message) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;background:#020617;color:#fff;padding:24px;font-family:system-ui,sans-serif;">
      <div style="max-width:720px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:20px;">
        <h1 style="margin:0 0 10px;font-size:20px;">App failed to start</h1>
        <p style="margin:0 0 8px;opacity:.9;">Open browser console and share this error.</p>
        <pre style="white-space:pre-wrap;word-break:break-word;opacity:.95;margin:0;">${String(message || "Unknown startup error")}</pre>
      </div>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  if (event?.error?.message) renderFatal(event.error.message);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event?.reason?.message || event?.reason || "Unhandled promise rejection";
  renderFatal(reason);
});

try {
  const root = document.getElementById("root");
  if (!root) throw new Error("Missing #root element");
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AuthGate>
            <AppStateProvider>
              <App />
            </AppStateProvider>
          </AuthGate>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  renderFatal(error?.message || error);
}
