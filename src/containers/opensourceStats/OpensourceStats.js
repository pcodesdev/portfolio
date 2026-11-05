import React, { Component } from "react";
import { Fade } from "../../components/motion/Reveal";
import "./OpensourceStats.css";
import pullRequestsData from "../../shared/opensource/pull_requests.json";
import issuesData from "../../shared/opensource/issues.json";

class OpensourceStats extends Component {
  render() {
    const theme = this.props.theme;

    // Every figure below is derived from the contribution snapshot in
    // src/shared/opensource. No contribution totals are hardcoded here.
    const trackedContributions =
      pullRequestsData.totalCount + issuesData.totalCount;

    const stats = [
      {
        id: 1,
        icon: "📊",
        title: "Total Contributions",
        value: trackedContributions.toLocaleString("en-US"),
        description: "Pull requests and issues tracked in this portfolio",
      },
      {
        id: 2,
        icon: "🔀",
        title: "Pull Requests",
        value: pullRequestsData.totalCount.toLocaleString("en-US"),
        description: `${pullRequestsData.merged} merged, ${pullRequestsData.open} open`,
      },
      {
        id: 3,
        icon: "🐛",
        title: "Issues Closed",
        value: issuesData.closed.toLocaleString("en-US"),
        description: `${issuesData.closed} of ${issuesData.totalCount} tracked issues closed`,
      },
      {
        id: 4,
        icon: "⭐",
        title: "Stars Earned",
        value: "—",
        description: "Not available from the tracked contribution data",
      },
    ];

    return (
      <div className="opensource-stats-main">
        <Fade bottom duration={2000} distance="20px">
          <div className="stats-container">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="stat-card"
                style={{
                  backgroundColor: theme.imageDark,
                  border: `1px solid ${theme.text}20`,
                }}
              >
                <div className="stat-icon" aria-hidden="true">
                  {stat.icon}
                </div>
                <h3 className="stat-value" style={{ color: theme.text }}>
                  {stat.value}
                </h3>
                <h4 className="stat-title" style={{ color: theme.text }}>
                  {stat.title}
                </h4>
                <p
                  className="stat-description"
                  style={{ color: theme.secondaryText }}
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    );
  }
}

export default OpensourceStats;
