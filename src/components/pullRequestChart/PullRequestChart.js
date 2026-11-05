import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Fade } from "../motion/Reveal";
import "./PullRequestChart.css";
import PullRequestData from "../../shared/opensource/pull_requests.json";
import { statusPalette } from "../../theme";

class PullRequestChart extends Component {
  render() {
    const data = {
      labels: ["Open", "Merged", "Closed"],
      datasets: [
        {
          data: [
            PullRequestData["open"],
            PullRequestData["merged"],
            PullRequestData["closed"],
          ],
          backgroundColor: [
            statusPalette.success,
            statusPalette.merged,
            statusPalette.error,
          ],
          hoverBackgroundColor: ["#176B34DD", "#56309ADD", "#A12632DD"],
        },
      ],
    };

    return (
      <div className="pr-chart">
        <Fade bottom duration={2000} distance="20px">
          <h2 className="pr-chart-header">Pull Request Distribution</h2>
        </Fade>
        <div
          role="img"
          aria-label={`Pull request distribution: ${PullRequestData.open} open, ${PullRequestData.merged} merged, ${PullRequestData.closed} closed.`}
        >
          <Doughnut
            data={data}
            options={{
              padding: "0",
              margin: "0",
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

export default PullRequestChart;
