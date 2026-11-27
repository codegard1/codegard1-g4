import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { site } from "./config/site";
import "./styles/normalize.css";
import "./styles/globals.css";

if (import.meta.env.PROD && site.gaMeasurementId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaMeasurementId}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", site.gaMeasurementId);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
