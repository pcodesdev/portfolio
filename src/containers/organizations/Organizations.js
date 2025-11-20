import React, { Component } from "react";
import "./Organizations.css";
import { Fade } from "react-reveal";
import OrganizationList from "../../components/organizationList/OrganizationList";
import OrganizationsData from "../../shared/opensource/organizations.json";

class Organizations extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div id="organizations">
        <div className="organizations-header-div">
          <Fade bottom duration={2000} distance="20px">
            <h1 className="organizations-header" style={{ color: theme.text }}>
              Open Source Contributions
            </h1>
            <p
              className="subTitle organizations-subtitle"
              style={{ color: theme.secondaryText }}
            >
              Passionate about giving back to the developer community through
              active open-source contributions. I collaborate on projects
              spanning web development, cloud infrastructure, educational
              technology, and developer tools. My contributions include bug
              fixes, feature implementations, documentation improvements, and
              code reviews across React, JavaScript, Python, and cloud-based
              repositories. Committed to fostering innovation, knowledge
              sharing, and building solutions that empower developers worldwide.
            </p>
          </Fade>
        </div>
        <div className="organizations-body-div">
          <Fade bottom duration={2000} distance="20px">
            <h2
              className="organizations-subheader"
              style={{ color: theme.text }}
            >
              Contributed Organizations
            </h2>
          </Fade>
          <OrganizationList logos={OrganizationsData["data"]} />
        </div>
      </div>
    );
  }
}

export default Organizations;
