import React, { Component } from "react";
import { Fade } from "react-reveal";
import "./OpensourceStats.css";

class OpensourceStats extends Component {
  render() {
    const theme = this.props.theme;

    const stats = [
      {
        id: 1,
        icon: "📊",
        title: "Total Contributions",
        value: "1,247",
        description: "Commits across all repositories",
      },
      {
        id: 2,
        icon: "🔀",
        title: "Pull Requests",
        value: "156",
        description: "Merged contributions",
      },
      {
        id: 3,
        icon: "🐛",
        title: "Issues Resolved",
        value: "89",
        description: "Bug fixes and enhancements",
      },
      {
        id: 4,
        icon: "⭐",
        title: "Stars Earned",
        value: "2,340",
        description: "Across contributed projects",
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
                <div className="stat-icon">{stat.icon}</div>
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
