import React from "react";
import { Link } from "react-router-dom";
import "./Greeting.css";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { greeting, homeHighlights } from "../../portfolio";
import { Fade } from "../../components/motion/Reveal";
import LazyImage from "../../components/LazyImage/LazyImage";

const portrait480 = require("../../assests/images/Peter-Portfolio-480.jpg");
const portrait720 = require("../../assests/images/Peter-Portfolio-720.webp");
const portrait960 = require("../../assests/images/Peter-Portfolio-960.jpg");

export default function Greeting(props) {
  const theme = props.theme;
  return (
    <div className="greet-main" id="greeting">
      <div className="greeting-main">
        <div className="greeting-text-div">
          <div>
            <h1 className="greeting-text" style={{ color: theme.text }}>
              {greeting.title}
            </h1>
            {greeting.nickname && (
              <h2 className="greeting-nickname" style={{ color: theme.text }}>
                ( {greeting.nickname} )
              </h2>
            )}
            <p
              className="greeting-text-p subTitle"
              style={{ color: theme.secondaryText }}
            >
              {greeting.subTitle}
            </p>
            <Fade bottom duration={400} delay={200}>
              <div className="home-social-motion">
                <SocialMedia theme={theme} />
              </div>
            </Fade>
            <Fade bottom duration={430} delay={250}>
              <div className="home-cta-container">
                <div
                  className="home-highlights"
                  aria-label="Professional highlights"
                >
                  {homeHighlights.map((highlight) => (
                    <span className="home-highlight" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>
                <nav className="home-actions" aria-label="Explore portfolio">
                  <Link className="home-action" to="/about">
                    Meet Peter
                  </Link>
                  <Link
                    className="home-action home-action-primary"
                    to="/projects"
                  >
                    Explore My Work
                  </Link>
                  <Link className="home-action" to="/experience">
                    View Professional Experience
                  </Link>
                  <Link className="home-action" to="/contact">
                    Contact Me
                  </Link>
                </nav>
              </div>
            </Fade>
          </div>
        </div>
        <div className="greeting-image-div">
          <LazyImage
            alt="Peter Njuguna Smiling"
            src={portrait960}
            srcSet={`${portrait480} 480w, ${portrait720} 720w, ${portrait960} 960w`}
            sizes="(max-width: 768px) 90vw, 42vw"
            loading="eager"
            fetchpriority="high"
            width="960"
            height="960"
          />
          {/* Peter Edit */}
          {/* <FeelingProud theme={theme} /> */}
        </div>
      </div>
    </div>
  );
}
