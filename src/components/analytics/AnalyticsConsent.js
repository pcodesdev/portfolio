import React, { useEffect, useState } from "react";
import "./AnalyticsConsent.css";

const consentKey = "portfolio-analytics-consent";

function readConsent() {
  try {
    return localStorage.getItem(consentKey);
  } catch (error) {
    return null;
  }
}

function routePath() {
  const route = window.location.hash.slice(1).split(/[?#]/)[0];
  const paths = [
    "/",
    "/home",
    "/about",
    "/expertise",
    "/projects",
    "/experience",
    "/education",
    "/opensource",
    "/contact",
    "/splash",
  ];
  return paths.includes(route) ? route : "/";
}

export default function AnalyticsConsent({
  id = process.env.REACT_APP_GOOGLE_ANALYTICS_ID || "",
}) {
  const measurementId = id.trim();
  const validId = /^G-[A-Z0-9]+$/.test(measurementId);
  const [consent, setConsent] = useState(readConsent);
  const [open, setOpen] = useState(
    () => readConsent() !== "granted" && readConsent() !== "denied"
  );

  useEffect(() => {
    const showPreferences = () => setOpen(true);
    window.addEventListener("open-analytics-preferences", showPreferences);
    return () => window.removeEventListener("open-analytics-preferences", showPreferences);
  }, []);

  useEffect(() => {
    if (!validId) return undefined;
    window[`ga-disable-${measurementId}`] = consent !== "granted";
    if (consent !== "granted") return undefined;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    if (!document.getElementById("portfolio-ga4")) {
      const script = document.createElement("script");
      script.id = "portfolio-ga4";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId
      )}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
    }
    window.gtag("config", measurementId, { send_page_view: false });
    let lastPath;
    const trackRoute = () => {
      const route = routePath();
      if (route === lastPath) return;
      lastPath = route;
      window.gtag("event", "page_view", {
        send_to: measurementId,
        page_location: `${window.location.origin}/#${route}`,
        page_path: `/#${route}`,
      });
    };
    trackRoute();
    window.addEventListener("hashchange", trackRoute);
    return () => window.removeEventListener("hashchange", trackRoute);
  }, [consent, measurementId, validId]);

  const choose = (value) => {
    window[`ga-disable-${measurementId}`] = value !== "granted";
    try {
      localStorage.setItem(consentKey, value);
    } catch (error) {
      /* preference remains in memory */
    }
    setConsent(value);
    setOpen(false);
  };

  if (!validId || !open) return null;
  return (
    <aside className="analytics-preferences" aria-label="Analytics preferences">
        <div role="group" aria-label="Analytics consent">
          <p>Allow optional analytics cookies to help improve this site?</p>
          <button type="button" onClick={() => choose("granted")}>
            Allow analytics
          </button>
          <button type="button" onClick={() => choose("denied")}>
            Decline
          </button>
        </div>
    </aside>
  );
}
