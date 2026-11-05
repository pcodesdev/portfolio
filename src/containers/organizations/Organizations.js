import React, { Component } from "react";
import "./Organizations.css";

class Organizations extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div id="organizations">
        <div className="organizations-header-div">
          <h1 className="organizations-header" style={{ color: theme.text }}>
            Open Source Contributions
          </h1>
          <p
            className="subTitle organizations-subtitle"
            style={{ color: theme.secondaryText }}
          >
            I contribute to open-source software through code, documentation,
            accessibility improvements, and issue reporting. Personal
            contribution records are shown only when their author attribution is
            verified; repository-wide activity is not presented as my own.
          </p>
          <a
            className="organizations-profile-link"
            href="https://github.com/pcodesdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            View current GitHub profile
          </a>
        </div>
      </div>
    );
  }
}

export default Organizations;
