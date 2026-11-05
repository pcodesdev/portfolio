import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Fade } from "../motion/Reveal";
import "./IssueChart.css";
import IssueData from "../../shared/opensource/issues.json";
import { statusPalette } from "../../theme";

class IssueChart extends Component {
  render() {
    const data = {
      labels: ["Open", "Closed"],
      datasets: [
        {
          data: [IssueData["open"], IssueData["closed"]],
          backgroundColor: [statusPalette.success, statusPalette.error],
          hoverBackgroundColor: ["#176B34DD", "#A12632DD"],
        },
      ],
    };

    return (
      <div className="issue-chart">
        <Fade bottom duration={2000} distance="20px">
          <h2 className="issue-chart-header">Issue Distribution</h2>
        </Fade>
        <div
          role="img"
          aria-label={`Issue distribution: ${IssueData.open} open, ${IssueData.closed} closed.`}
        >
          <Doughnut
            data={data}
            options={{
              margin: "0",
              padding: "0",
              responsive: true,
              maintainAspectRatio: true,
              animation: {
                duration: 4000,
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default IssueChart;
