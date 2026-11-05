import React, { Component } from "react";
import "./Issues.css";
import { Fade } from "../../components/motion/Reveal";
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
              Issues reported in open-source repositories, covering bug reports,
              enhancement requests, deployment and authentication problems, and
              documentation improvements. Each card shows whether the issue is
              currently open or closed.
            </p>
          </Fade>
        </div>
        <div className="issues-body-div">
          {issuesData["data"].map((issue) => {
            return <IssueCard key={issue.id} issue={issue} />;
          })}
        </div>
      </div>
    );
  }
}

export default Issues;
