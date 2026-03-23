import React from "react";
import ReactDOM from "react-dom/client";
import DailyTrackerApp from "./DailyTrackerApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DailyTrackerApp />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Offline support is optional; the app still works without registration.
    });
  });
}
