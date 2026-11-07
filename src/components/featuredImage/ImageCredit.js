import React from "react";
import "./ImageCredit.css";
export default function ImageCredit({ meta }) {
  if (!meta || !meta.attribution || meta.license === "owner") return null;
  return (
    <p className="featured-image-credit">
      {meta.sourceUrl ? (
        <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer">
          {meta.attribution}
        </a>
      ) : (
        meta.attribution
      )}
    </p>
  );
}
