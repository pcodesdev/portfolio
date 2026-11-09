import React, { useEffect, useState } from "react";
import "./AnalyticsPreferences.css";

const storageKey = "portfolio-analytics-consent";
const measurementId = "G-ZR4HM0S3MY";

function readChoice() {
  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    return null;
  }
}

function updateAnalytics(choice) {
  window[`ga-disable-${measurementId}`] = choice !== "allowed";
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: choice === "allowed" ? "granted" : "denied",
    });
  }
  if (
    choice !== "allowed" ||
    document.getElementById("portfolio-analytics-script")
  )
    return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  const script = document.createElement("script");
  script.id = "portfolio-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export default function AnalyticsPreferences() {
  const [choice, setChoice] = useState(readChoice);
  const [open, setOpen] = useState(
    () => !["allowed", "declined"].includes(readChoice())
  );

  useEffect(() => {
    updateAnalytics(choice);
  }, [choice]);

  useEffect(() => {
    const showPreferences = () => setOpen(true);
    window.addEventListener("open-analytics-preferences", showPreferences);
    return () =>
      window.removeEventListener("open-analytics-preferences", showPreferences);
  }, []);

  const choose = (value) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {}
    updateAnalytics(value);
    setChoice(value);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <aside className="analytics-preferences" aria-label="Analytics preferences">
      <p>Allow optional analytics cookies to help improve this site?</p>
      <div>
        <button type="button" onClick={() => choose("allowed")}>
          Allow analytics
        </button>
        <button type="button" onClick={() => choose("declined")}>
          Decline
        </button>
      </div>
    </aside>
  );
}
