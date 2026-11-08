import React from "react";
import "./Footer.css";
import { Fade } from "../motion/Reveal";
/* eslint-disable jsx-a11y/accessible-emoji */

// Get current year
const currentYear = new Date().getFullYear();

export default function Footer(props) {
  return (
    <div className="footer-div">
      <Fade>
        <p className="footer-text" style={{ color: props.theme.secondaryText }}>
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by{" "}
          <a className="footer-brand-link" href="https://pemahtech.com">
            pemahtech.com
          </a>{" "}
          &copy; {currentYear}
        </p>
        <button type="button" className="analytics-settings-link" onClick={() => window.dispatchEvent(new Event("open-analytics-preferences"))}>
          Analytics preferences
        </button>
        {/* <ToggleSwitch theme={props.theme} onToggle={props.onToggle}/> */}
      </Fade>
    </div>
  );
}
