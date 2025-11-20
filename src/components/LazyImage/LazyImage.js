import React from "react";
import PropTypes from "prop-types";

const LazyImage = ({ src, alt, className, style, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default LazyImage;
