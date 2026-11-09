import React from "react";
import "./Footer.css";
import { Fade } from "../motion/Reveal";

const currentYear = new Date().getFullYear();

export default function Footer(props) {
  return (
    <footer className="footer-div" style={{ color: props.theme.secondaryText }}>
      <Fade>
        <div className="footer-inner">
          <div className="footer-main">
            <div className="footer-identity">
              <p className="footer-name">Peter Njuguna</p>
              <p className="footer-attribution">
                Portfolio designed and developed by{" "}
                <a className="footer-brand-link" href="https://pemahtech.com">
                  pemahtech.com
                </a>
              </p>
              <a className="footer-contact-link" href="#/contact">
                Discuss an opportunity <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            <div className="footer-professional-details">
              <section
                className="footer-detail"
                aria-labelledby="footer-competencies"
              >
                <h2 id="footer-competencies">Competencies</h2>
                <p>
                  Project management, AI engineering and implementation, digital
                  transformation, EdTech and digital learning, digital skills
                  and workforce development, full-stack development, and cloud
                  solutions.
                </p>
              </section>
              <section
                className="footer-detail"
                aria-labelledby="footer-services"
              >
                <h2 id="footer-services">Services</h2>
                <p>
                  Programme coordination and implementation; digital-skills
                  training; technology-enabled learning; and practical software
                  and technology solutions.
                </p>
              </section>
              <section
                className="footer-detail"
                aria-labelledby="footer-open-to"
              >
                <h2 id="footer-open-to">Open to</h2>
                <p>
                  Project and programme delivery roles, digital transformation
                  and EdTech opportunities, and software or technology
                  engagements.
                </p>
              </section>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              &copy; {currentYear} Peter Njuguna
            </p>
            <button
              type="button"
              className="analytics-settings-link"
              onClick={() =>
                window.dispatchEvent(new Event("open-analytics-preferences"))
              }
            >
              Analytics preferences
            </button>
          </div>
        </div>
      </Fade>
    </footer>
  );
}
