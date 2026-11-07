import React, { useState } from "react";
import "./PublicationCard.css";
import { Fade } from "../motion/Reveal";
import ImageCredit from "../featuredImage/ImageCredit";

const GENERIC_ARTICLE_IMAGE = "/images/articles/article-generic.svg";
const CARD_IMAGE_SIZES =
  "(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 380px";

function PublicationCardImage({ pub }) {
  const meta = pub.imageMeta || null;
  const fallbackImage = pub.fallbackImage || GENERIC_ARTICLE_IMAGE;
  const primary = (meta && meta.src) || pub.image || fallbackImage;
  const [source, setSource] = useState(primary);
  const [failed, setFailed] = useState(false);
  const showingPrimary = Boolean(meta) && source === primary;

  function handleError() {
    if (source !== fallbackImage) setSource(fallbackImage);
    else if (source !== GENERIC_ARTICLE_IMAGE) setSource(GENERIC_ARTICLE_IMAGE);
    else setFailed(true);
  }

  if (failed) {
    return (
      <div
        className="publication-card-media publication-card-image-placeholder"
        role="img"
        aria-label={`${pub.name} article cover`}
      >
        <span>Article</span>
      </div>
    );
  }
  return (
    <div className="publication-card-media">
      <img
        className="publication-card-image"
        src={source}
        srcSet={showingPrimary && meta.srcSet ? meta.srcSet : undefined}
        sizes={showingPrimary && meta.srcSet ? CARD_IMAGE_SIZES : undefined}
        width={(showingPrimary && meta.width) || 960}
        height={(showingPrimary && meta.height) || 540}
        alt={(showingPrimary && meta.alt) || `${pub.name} article cover`}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
    </div>
  );
}

export default function PublicationCard({ pub, theme, revealDelay = 0 }) {
  return (
    <article
      className="publication-card-div"
      style={{
        backgroundColor: theme.body,
        border: `1px solid ${theme.text}33`,
        color: theme.text,
      }}
    >
      <a
        className="publication-card-link"
        href={pub.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: theme.text }}
        aria-label={`Read "${pub.name}" on Medium (opens in a new tab)`}
      >
        <PublicationCardImage pub={pub} />
        <Fade bottom duration={420} delay={revealDelay}>
          <div className="publication-card-content">
            <span className="publication-source" style={{ color: theme.text }}>
              <i className="fab fa-medium" aria-hidden="true"></i> Medium
              article
            </span>
            <div className="publication-name-div">
              <h3 className="publication-name" style={{ color: theme.text }}>
                {pub.name}
              </h3>
            </div>
            <p
              className="publication-description"
              style={{ color: theme.text }}
            >
              {pub.description}
            </p>
            <div className="publication-details">
              <p
                className="publication-creation-date subTitle"
                style={{ color: theme.secondaryText }}
              >
                Published on{" "}
                <time dateTime={pub.createdAt}>
                  {pub.createdAt.split("T")[0]}
                </time>
              </p>
            </div>
          </div>
        </Fade>
      </a>
      <ImageCredit meta={pub.imageMeta} />
    </article>
  );
}
