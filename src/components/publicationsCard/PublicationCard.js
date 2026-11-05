import React from "react";
import "./PublicationCard.css";
import { Fade } from "../motion/Reveal";

export default function PublicationCard({ pub, theme, revealDelay = 0 }) {
  return (
    <a
      className="publication-card-div"
      href={pub.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: theme.body,
        border: `1px solid ${theme.text}33`,
        color: theme.text,
      }}
      aria-label={`Read "${pub.name}" on Medium (opens in a new tab)`}
    >
      {pub.image ? (
        <img
          className="publication-card-image"
          src={pub.image}
          alt={`${pub.name} article cover`}
          loading="lazy"
        />
      ) : null}
      <Fade bottom duration={420} delay={revealDelay}>
        <div className="publication-card-content">
          <span className="publication-source" style={{ color: theme.text }}>
            <i className="fab fa-medium" aria-hidden="true"></i> Medium
          </span>
          <div className="publication-name-div">
            <p className="publication-name" style={{ color: theme.text }}>
              {pub.name}
            </p>
          </div>
          <p className="publication-description" style={{ color: theme.text }}>
            {pub.description}
          </p>
          <div className="publication-details">
            <p
              className="publication-creation-date subTitle"
              style={{ color: theme.secondaryText }}
            >
              Published on {pub.createdAt.split("T")[0]}
            </p>
          </div>
        </div>
      </Fade>
    </a>
  );
}
