import React, { useEffect, useRef, useState } from "react";
import Organizations from "../../containers/organizations/Organizations";
import githubSnapshot from "../../shared/opensource/github_stats_snapshot.json";
import "./OpenSourceOverview.css";

const GITHUB_ENDPOINT =
  typeof window !== "undefined" &&
  typeof window.PORTFOLIO_GITHUB_STATS_ENDPOINT === "string"
    ? window.PORTFOLIO_GITHUB_STATS_ENDPOINT
    : "";

const numberFormat = new Intl.NumberFormat("en-US");

function displayNumber(value) {
  return Number.isFinite(value) ? numberFormat.format(value) : "Unavailable";
}

function distributionStyle(values, colors) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!total)
    return { background: "conic-gradient(rgba(127, 127, 127, 0.18) 0 100%)" };
  let end = 0;
  const stops = values.map((value, index) => {
    const start = end;
    end += (value / total) * 100;
    return `${colors[index]} ${start}% ${end}%`;
  });
  return {
    background: `conic-gradient(${stops.join(", ")})`,
  };
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default function OpenSourceOverview({ theme }) {
  const overviewRef = useRef(null);
  const [snapshot, setSnapshot] = useState(githubSnapshot);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  useEffect(() => {
    if (window.Iconify && typeof window.Iconify.scanDOM === "function") {
      window.Iconify.scanDOM(overviewRef.current);
    }
  }, []);

  const refreshGitHubData = async () => {
    if (!GITHUB_ENDPOINT) return;
    setRefreshing(true);
    setRefreshError("");
    try {
      const response = await fetch(GITHUB_ENDPOINT, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok)
        throw new Error(`GitHub refresh returned ${response.status}.`);
      const freshSnapshot = await response.json();
      if (
        freshSnapshot.profile?.login !== "pcodesdev" ||
        !freshSnapshot.summary
      ) {
        throw new Error(
          "GitHub response did not match the verified portfolio profile."
        );
      }
      setSnapshot(freshSnapshot);
    } catch (error) {
      setSnapshot((current) => ({ ...current, freshness: "stale" }));
      setRefreshError(
        "Live refresh failed. Showing the most recent cached data available."
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (GITHUB_ENDPOINT) refreshGitHubData();
  }, []);

  const summary = snapshot.summary || {};
  const pullRequests = (snapshot.pullRequests || []).filter(
    (record) => record.author === snapshot.profile?.login
  );
  const issues = (snapshot.issues || []).filter(
    (record) => record.author === snapshot.profile?.login
  );
  const summaryCards = [
    {
      title: "Pull Requests",
      value: displayNumber(summary.pullRequests),
      icon: "mdi:source-pull",
      detail: `${displayNumber(
        summary.pullRequestsMerged
      )} merged · ${displayNumber(
        summary.pullRequestsOpen
      )} open · ${displayNumber(
        summary.pullRequestsClosedUnmerged
      )} closed unmerged`,
    },
    {
      title: "Issues Closed",
      value: `${displayNumber(summary.issuesClosed)} closed`,
      icon: "mdi:check-circle-outline",
      detail: `${displayNumber(
        summary.issues
      )} authored issues (${displayNumber(
        summary.issuesOpen
      )} open). Closed status does not establish who resolved an issue.`,
    },
    {
      title: "Stars Earned",
      value: displayNumber(summary.ownedRepositoryStars),
      icon: "mdi:star-outline",
      detail: `Stars across ${displayNumber(
        summary.publicRepositories
      )} repositories owned by ${snapshot.profile?.login}; ${displayNumber(
        summary.ownedRepositoryForks
      )} forks. Not stars on unrelated repositories.`,
    },
  ];
  const distributions = [
    {
      id: "pull-requests",
      title: "Pull Request Distribution",
      values: [
        summary.pullRequestsOpen || 0,
        summary.pullRequestsMerged || 0,
        summary.pullRequestsClosedUnmerged || 0,
      ],
      labels: ["Open", "Merged", "Closed unmerged"],
      colors: ["#176B34", "#56309A", "#A12632"],
    },
    {
      id: "issues",
      title: "Issue Distribution",
      values: [summary.issuesOpen || 0, summary.issuesClosed || 0],
      labels: ["Open", "Closed"],
      colors: ["#176B34", "#A12632"],
    },
  ];
  return (
    <main
      ref={overviewRef}
      className="opensource-page"
      style={{ color: theme.text }}
    >
      <Organizations theme={theme} />

      <section
        className="opensource-summary"
        aria-labelledby="opensource-summary-heading"
      >
        <div className="opensource-section-heading">
          <h2 id="opensource-summary-heading">Contribution Summary</h2>
          <p style={{ color: theme.secondaryText }}>
            GitHub profile:{" "}
            <strong>{snapshot.profile?.login || "pcodesdev"}</strong>.
          </p>
          {snapshot.warning || refreshError ? (
            <p className="opensource-refresh-warning" role="status">
              {refreshError || snapshot.warning}
            </p>
          ) : null}
          {GITHUB_ENDPOINT ? (
            <button
              type="button"
              className="opensource-refresh-button"
              disabled={refreshing}
              onClick={refreshGitHubData}
            >
              {refreshing ? "Refreshing…" : "Refresh GitHub data"}
            </button>
          ) : null}
        </div>
        <div className="opensource-summary-grid">
          {summaryCards.map((card) => (
            <article
              className="opensource-summary-card"
              key={card.title}
              style={{
                backgroundColor: theme.body,
                borderColor: `${theme.text}30`,
              }}
            >
              <span
                className="iconify opensource-summary-icon"
                data-icon={card.icon}
                data-inline="false"
                aria-hidden="true"
              />
              <p className="opensource-summary-value">{card.value}</p>
              <h3>{card.title}</h3>
              <p style={{ color: theme.secondaryText }}>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="opensource-distributions"
        aria-labelledby="opensource-distribution-heading"
      >
        <div className="opensource-section-heading">
          <h2 id="opensource-distribution-heading">Contributions</h2>
          <p style={{ color: theme.secondaryText }}>
            Pull requests and issues are filtered to author login{" "}
            <strong>{snapshot.profile?.login}</strong>; repository statistics
            below cover repositories owned by that account.
          </p>
        </div>
        <div className="opensource-chart-grid">
          {distributions.map((source) => (
            <article
              className="opensource-chart-card"
              key={source.id}
              style={{
                backgroundColor: theme.body,
                borderColor: `${theme.text}30`,
              }}
            >
              <h3>{source.title}</h3>
              <div className="opensource-chart-summary">
                <p className="opensource-chart-total">
                  <span>
                    {numberFormat.format(
                      source.values.reduce((sum, value) => sum + value, 0)
                    )}
                  </span>
                  <span style={{ color: theme.secondaryText }}>Total</span>
                </p>
                <div
                  className="opensource-chart-donut"
                  role="img"
                  aria-label={`${source.title}: ${source.labels
                    .map((label, index) => `${label} ${source.values[index]}`)
                    .join(", ")}`}
                  style={{
                    ...distributionStyle(source.values, source.colors),
                    "--opensource-donut-hole": theme.body,
                  }}
                >
                  <span aria-hidden="true" />
                </div>
              </div>
              <ul
                className="opensource-legend"
                aria-label={`${source.title} status legend`}
              >
                {source.labels.map((label, index) => (
                  <li key={label}>
                    <span className="opensource-legend-label">
                      <span
                        className="opensource-legend-swatch"
                        style={{ backgroundColor: source.colors[index] }}
                      />
                      {label}
                    </span>
                    <strong>{numberFormat.format(source.values[index])}</strong>
                  </li>
                ))}
              </ul>
              <p
                className="opensource-chart-note"
                style={{ color: theme.secondaryText }}
              >
                Counts reflect GitHub search results authored by{" "}
                {snapshot.profile?.login || "pcodesdev"}.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="opensource-records"
        aria-labelledby="opensource-records-heading"
      >
        <div className="opensource-section-heading">
          <h2 id="opensource-records-heading">Contribution Records</h2>
          <p style={{ color: theme.secondaryText }}>
            Recent returned records are filtered by author login{" "}
            {snapshot.profile?.login}.
          </p>
        </div>
        <div className="opensource-records-grid">
          <div className="opensource-record-list">
            <h3>
              Recent Personal Pull Requests ({pullRequests.length} returned)
            </h3>
            {pullRequests.map((record) => (
              <article
                className="opensource-record-card"
                key={record.id}
                style={{
                  backgroundColor: theme.body,
                  borderColor: `${theme.text}30`,
                }}
              >
                <div className="opensource-record-heading">
                  {record.avatarUrl ? (
                    <img
                      src={record.avatarUrl}
                      alt={`Avatar for ${record.author}`}
                      loading="lazy"
                    />
                  ) : null}
                  <div>
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {record.title}
                    </a>
                    <p>
                      {record.repository} · #{record.number} ·{" "}
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`opensource-state opensource-state--${record.state}`}
                  >
                    {record.state}
                  </span>
                </div>
                <p>
                  {record.changedFiles == null
                    ? "File details unavailable"
                    : record.changedFiles > 1000
                    ? "GitHub reports an unusually large diff; verify the PR details before citing its size."
                    : `${record.changedFiles} files changed · +${record.additions} / −${record.deletions}`}
                </p>
              </article>
            ))}
          </div>
          <div className="opensource-record-list">
            <h3>
              Recent Personal Issues ({issues.length} of {summary.issues}{" "}
              returned)
            </h3>
            {issues.map((record) => (
              <article
                className="opensource-record-card"
                key={record.id}
                style={{
                  backgroundColor: theme.body,
                  borderColor: `${theme.text}30`,
                }}
              >
                <div className="opensource-record-heading">
                  {record.avatarUrl ? (
                    <img
                      src={record.avatarUrl}
                      alt={`Avatar for ${record.author}`}
                      loading="lazy"
                    />
                  ) : null}
                  <div>
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {record.title}
                    </a>
                    <p>
                      {record.repository} · #{record.number} ·{" "}
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`opensource-state opensource-state--${record.state}`}
                  >
                    {record.state}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
