function normalizePullRequests(records, login) {
  return (Array.isArray(records) ? records : [])
    .filter((record) => record?.user?.login === login)
    .map((record) => ({
      id: `pr-${record.repository_url?.split("/repos/")[1] || "unknown"}-${
        record.number
      }`,
      title: record.title || "Untitled pull request",
      url: record.html_url,
      repository:
        record.repository_url?.split("/repos/")[1] || "Unknown repository",
      state: record.pull_request?.merged_at
        ? "merged"
        : record.state === "open"
        ? "open"
        : "closed",
      number: record.number,
      createdAt: record.created_at,
      closedAt: record.closed_at || null,
      mergedAt: record.pull_request?.merged_at || null,
      changedFiles: Number.isFinite(record.changed_files)
        ? record.changed_files
        : null,
      additions: Number.isFinite(record.additions) ? record.additions : null,
      deletions: Number.isFinite(record.deletions) ? record.deletions : null,
      author: login,
      avatarUrl: record.user.avatar_url || null,
    }));
}

function normalizeIssues(records, login) {
  return (Array.isArray(records) ? records : [])
    .filter((record) => record?.user?.login === login && !record.pull_request)
    .map((record) => ({
      id: `issue-${record.repository_url?.split("/repos/")[1] || "unknown"}-${
        record.number
      }`,
      title: record.title || "Untitled issue",
      url: record.html_url,
      repository:
        record.repository_url?.split("/repos/")[1] || "Unknown repository",
      state: record.state === "closed" ? "closed" : "open",
      number: record.number,
      createdAt: record.created_at,
      closedAt: record.closed_at || null,
      author: login,
      avatarUrl: record.user.avatar_url || null,
    }));
}

function summarizeRepositoryContributions(pullRequests, issues) {
  const repositories = new Map();
  [...pullRequests, ...issues].forEach((record) => {
    const current = repositories.get(record.repository) || {
      repository: record.repository,
      pullRequests: 0,
      issues: 0,
      url: `https://github.com/${record.repository}`,
    };
    if (record.id.startsWith("pr-")) current.pullRequests += 1;
    else current.issues += 1;
    repositories.set(record.repository, current);
  });
  return [...repositories.values()].sort(
    (left, right) =>
      right.pullRequests + right.issues - (left.pullRequests + left.issues)
  );
}

function buildGitHubSnapshot({
  profile,
  repositories,
  pullRequests,
  issues,
  prTotal,
  issueTotal,
  issueOpenTotal,
  issueClosedTotal,
  commitSearchMatches,
  contributionCalendar,
  fetchedAt = new Date().toISOString(),
  freshness = "live",
}) {
  const login = profile.login;
  const personalPullRequests = normalizePullRequests(pullRequests, login);
  const personalIssues = normalizeIssues(issues, login);
  const ownedRepositories = (repositories || []).filter(
    (repository) => repository.owner?.login === login
  );
  const merged = personalPullRequests.filter((record) => record.mergedAt)
    .length;
  const openPullRequests = personalPullRequests.filter(
    (record) => record.state === "open"
  ).length;
  const closedUnmerged = personalPullRequests.filter(
    (record) => record.state === "closed"
  ).length;
  const recentIssues = personalIssues
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const recentPullRequests = personalPullRequests
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    profile: {
      login,
      id: profile.id,
      name: profile.name,
      url: profile.html_url || `https://github.com/${login}`,
    },
    summary: {
      publicRepositories: profile.public_repos,
      ownedRepositoryStars: ownedRepositories.reduce(
        (total, repository) => total + repository.stargazers_count,
        0
      ),
      ownedRepositoryForks: ownedRepositories.reduce(
        (total, repository) => total + repository.forks_count,
        0
      ),
      ownedRepositoriesIncludedInStarTotal: ownedRepositories.length,
      commitSearchMatches: commitSearchMatches ?? null,
      commitsLastYear: contributionCalendar?.totalCommitContributions ?? null,
      contributionCalendarTotal:
        contributionCalendar?.totalContributions ?? null,
      pullRequests: prTotal ?? personalPullRequests.length,
      pullRequestsOpen: openPullRequests,
      pullRequestsMerged: merged,
      pullRequestsClosedUnmerged: closedUnmerged,
      issues: issueTotal ?? personalIssues.length,
      issuesOpen:
        issueOpenTotal ??
        personalIssues.filter((record) => record.state === "open").length,
      issuesClosed:
        issueClosedTotal ??
        personalIssues.filter((record) => record.state === "closed").length,
      issueRecordsReturned: personalIssues.length,
      repositoriesWithReturnedAuthoredRecords: summarizeRepositoryContributions(
        personalPullRequests,
        personalIssues
      ).length,
    },
    repositoryContributions: summarizeRepositoryContributions(
      personalPullRequests,
      personalIssues
    ),
    contributionCalendar: contributionCalendar?.weeks || null,
    contributionCalendarPeriod: contributionCalendar
      ? {
          from: contributionCalendar.periodFrom,
          to: contributionCalendar.periodTo,
        }
      : null,
    pullRequests: recentPullRequests,
    issues: recentIssues,
    retrievedAt: fetchedAt,
    freshness,
    source:
      "GitHub public REST API; contribution calendar via authenticated GraphQL when configured",
  };
}

function normalizeGitHubPages(pages) {
  return (pages || []).flatMap((page) => (Array.isArray(page) ? page : []));
}

function snapshotToKnowledgeDocuments(snapshot) {
  if (!snapshot || snapshot.profile?.login !== "pcodesdev") return [];
  const freshnessText = `GitHub data status: ${
    snapshot.freshness || "cached"
  }; last successful retrieval ${snapshot.retrievedAt || "unknown"}.`;
  const summary = snapshot.summary || {};
  const documents = [
    {
      id: "github-profile-summary",
      title: "Verified GitHub Profile Statistics",
      url: "/#/opensource",
      externalUrl: snapshot.profile.url,
      domain: "open-source",
      content: `GitHub username ${snapshot.profile.login}. ${
        summary.publicRepositories
      } public repositories. ${summary.pullRequests} pull requests authored: ${
        summary.pullRequestsMerged
      } merged and ${summary.pullRequestsOpen} open. ${
        summary.issues
      } issues authored: ${summary.issuesClosed} closed and ${
        summary.issuesOpen
      } open. ${
        summary.commitSearchMatches
      } public commit-search matches (not contribution calendar). ${
        summary.ownedRepositoryStars
      } stars and ${
        summary.ownedRepositoryForks
      } forks across owned public repositories. ${
        summary.contributionCalendarTotal == null
          ? "Contribution calendar unavailable without authenticated GraphQL."
          : `${summary.contributionCalendarTotal} contribution-calendar entries.`
      } ${freshnessText}`,
    },
    ...(snapshot.repositoryContributions || []).map((repository, index) => ({
      id: `github-repository-activity-${index + 1}`,
      title: `GitHub activity in ${repository.repository}`,
      url: "/#/opensource",
      externalUrl: repository.url,
      domain: "open-source",
      content: `${repository.pullRequests} author-verified pull requests and ${repository.issues} returned author-verified issues in ${repository.repository}. ${freshnessText}`,
    })),
    ...(snapshot.pullRequests || []).map((record) => ({
      id: record.id,
      title: `Pull request: ${record.title}`,
      url: "/#/opensource",
      externalUrl: record.url,
      domain: "open-source",
      content: `${record.state} pull request #${record.number} authored by ${
        record.author
      } in ${record.repository}; created ${record.createdAt}; ${
        record.changedFiles ?? "unknown"
      } files changed. ${freshnessText}`,
    })),
    ...(snapshot.issues || []).map((record) => ({
      id: record.id,
      title: `Issue: ${record.title}`,
      url: "/#/opensource",
      externalUrl: record.url,
      domain: "open-source",
      content: `${record.state} issue #${record.number} authored by ${record.author} in ${record.repository}; created ${record.createdAt}. ${freshnessText}`,
    })),
  ];
  return documents;
}

module.exports = {
  normalizePullRequests,
  normalizeIssues,
  summarizeRepositoryContributions,
  buildGitHubSnapshot,
  normalizeGitHubPages,
  snapshotToKnowledgeDocuments,
};
