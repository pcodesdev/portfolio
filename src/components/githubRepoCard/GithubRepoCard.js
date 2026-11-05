import React, { useState } from "react";
import ProjectLanguages from "../../components/projectLanguages/ProjectLanguages";
import "./GithubRepoCard.css";
import { Fade } from "../motion/Reveal";

const GENERIC_PROJECT_IMAGE = "/images/projects/project-generic.svg";

export function ProjectCardImage({ repo }) {
  const fallbackImage = repo.fallbackImage || GENERIC_PROJECT_IMAGE;
  const [imageSource, setImageSource] = useState(repo.image || fallbackImage);
  const [imageFailed, setImageFailed] = useState(false);

  function handleImageError() {
    if (imageSource === GENERIC_PROJECT_IMAGE) {
      setImageFailed(true);
    } else if (imageSource !== fallbackImage) {
      setImageSource(fallbackImage);
    } else if (fallbackImage !== GENERIC_PROJECT_IMAGE) {
      setImageSource(GENERIC_PROJECT_IMAGE);
    } else {
      setImageFailed(true);
    }
  }

  return (
    <div className="repo-card-media">
      {imageFailed ? (
        <div
          className="repo-card-image-placeholder"
          role="img"
          aria-label={`${repo.name} project preview`}
        >
          <svg aria-hidden="true" viewBox="0 0 48 48">
            <rect x="5" y="7" width="38" height="34" rx="5" />
            <path d="M5 16h38M12 12h.1M16 12h.1M20 12h.1M15 25h18M15 31h12" />
          </svg>
          <span>Project preview</span>
        </div>
      ) : (
        <img
          className="repo-card-image"
          src={imageSource}
          alt={repo.imageAlt || `${repo.name} project illustration`}
          loading="lazy"
          onError={handleImageError}
        />
      )}
    </div>
  );
}

export default function GithubRepoCard({ repo, theme, revealDelay = 0 }) {
  return (
    <article
      className="repo-card-div"
      style={{
        backgroundColor: theme.body,
        border: `1px solid ${theme.text}33`,
        color: theme.text,
      }}
    >
      <ProjectCardImage repo={repo} />
      <Fade bottom duration={420} delay={revealDelay}>
        <div className="repo-card-content">
          <p
            className="repo-project-type"
            style={{ color: theme.secondaryText }}
          >
            {repo.projectType}
          </p>
          <div className="repo-name-div">
            <svg
              aria-hidden="true"
              className="octicon repo-svg"
              height="16"
              role="img"
              viewBox="0 0 12 16"
              width="12"
            >
              <path
                fillRule="evenodd"
                d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"
              ></path>
            </svg>
            <a
              className="repo-name"
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.text }}
            >
              {repo.name}
            </a>
          </div>
          <p className="repo-description" style={{ color: theme.text }}>
            {repo.description}
          </p>
          <p className="repo-context" style={{ color: theme.text }}>
            <strong>Use case:</strong> {repo.useCase}
          </p>
          <p className="repo-context" style={{ color: theme.text }}>
            <strong>Engineering focus:</strong> {repo.engineeringFocus}
          </p>
          <p className="repo-stack" style={{ color: theme.secondaryText }}>
            <strong>Stack:</strong> {repo.stack}
          </p>
          <div className="repo-details">
            <p
              className="repo-creation-date subTitle"
              style={{ color: theme.secondaryText }}
            >
              Created on {repo.createdAt.split("T")[0]}
            </p>
            <ProjectLanguages
              className="repo-languages"
              logos={repo.languages}
            />
          </div>
          <div className="repo-links">
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>
            {repo.homepage ? (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                Live demo
              </a>
            ) : null}
          </div>
          {/* <div className="repo-stats">
          <div className="repo-left-stat">
            <span>
              <div className="language-color" style={{ backgroundColor: repo.node.primaryLanguage.color }}></div>
              <p>{repo.node.primaryLanguage.name}</p>
            </span>
            <span>
              <svg aria-hidden="true" className="octicon" height="16" role="img" viewBox="0 0 10 16" width="10" fill="rgb(106, 115, 125)" className="repo-star-svg">
                <path
                  fillRule="evenodd"
                  d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
                ></path>
              </svg>
              <p>{repo.node.forkCount}</p>
            </span>
            <span>
              <svg aria-hidden="true" className="octicon" height="16" role="img" viewBox="0 0 14 16" width="14" fill="rgb(106, 115, 125)" className="repo-star-svg">
                <path fillRule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path>
              </svg>
              <p>{repo.node.stargazers.totalCount}</p>
            </span>
          </div>
          <div className="repo-right-stat">
            <p>{repo.node.diskUsage} KB</p>
          </div>
        </div> */}
        </div>
      </Fade>
    </article>
  );
}
