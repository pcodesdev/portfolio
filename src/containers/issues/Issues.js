import React, { Component } from "react";
import "./Issues.css";
import { Fade } from "react-reveal";
import IssueCard from "../../components/issueCard/IssueCard";
import issuesData from "../../shared/opensource/issues.json";

class Issues extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div>
        <div className="issues-header-div">
          <Fade bottom duration={2000} distance="20px">
            <h1 className="issues-header" style={{ color: theme.text }}>
              Issues
            </h1>
            <p
              className="subTitle issues-subtitle"
              style={{ color: theme.secondaryText }}
            >
              Identifying and resolving technical challenges across diverse
              open-source projects. Contributions include reporting bugs,
              suggesting enhancements, troubleshooting deployment issues, and
              collaborating with maintainers to improve project quality and user
              experience.
            </p>
          </Fade>
        </div>
        <div className="issues-body-div">
          {issuesData["data"].map((issue) => {
            return <IssueCard issue={issue} />;
          })}
        </div>
      </div>
    );
  }
}

export default Issues;
