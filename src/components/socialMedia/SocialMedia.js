import React, { memo } from "react";
import "./SocialMedia.css";
import { socialMediaLinks } from "../../portfolio";
import styled from "styled-components";

const IconWrapper = styled.span`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  i,
  svg {
    background-color: ${(props) => props.backgroundColor};
  }
  &:hover i,
  &:hover svg {
    background-color: #233c4a;
    transition: 0.3s ease-in;
  }
`;

const SocialMedia = memo(function SocialMedia(props) {
  return (
    <div className="social-media-div">
      {socialMediaLinks.map((media, i) => {
        return (
          <a
            key={i}
            href={media.link}
            className={`icon-button`}
            aria-label={media.name}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <IconWrapper {...media} {...props}>
              {media.icon === "x" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  focusable="false"
                  style={{ textDecoration: "none" }}
                >
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.594l5.243 6.932zm-1.29 19.493h2.039L6.486 3.24H4.298z" />
                </svg>
              ) : (
                <i
                  className={`fab ${media.fontAwesomeIcon}`}
                  aria-hidden="true"
                  style={{ textDecoration: "none" }}
                />
              )}
            </IconWrapper>
            {/* <span></span> */}
          </a>
        );
      })}
    </div>
  );
});

export default SocialMedia;
