const {
  buildGitHubSnapshot,
  normalizeIssues,
  normalizePullRequests,
  normalizeGitHubPages,
  summarizeRepositoryContributions,
  snapshotToKnowledgeDocuments,
} = require("./github-data");

const pr = (overrides = {}) => ({
  number: 7,
  title: "Add accessibility improvements",
  html_url: "https://github.com/example/repo/pull/7",
  repository_url: "https://api.github.com/repos/example/repo",
  state: "closed",
  created_at: "2025-01-01T00:00:00Z",
  closed_at: "2025-01-02T00:00:00Z",
  changed_files: 2,
  additions: 8,
  deletions: 1,
  user: { login: "pcodesdev", avatar_url: "https://avatars.example/peter.png" },
  pull_request: { merged_at: "2025-01-02T00:00:00Z" },
  ...overrides,
});

const issue = (overrides = {}) => ({
  number: 9,
  title: "Report a navigation bug",
  html_url: "https://github.com/example/repo/issues/9",
  repository_url: "https://api.github.com/repos/example/repo",
  state: "closed",
  created_at: "2025-02-01T00:00:00Z",
  closed_at: "2025-02-02T00:00:00Z",
  user: { login: "pcodesdev", avatar_url: "https://avatars.example/peter.png" },
  ...overrides,
});

test("personal PRs and issues are filtered by author login, not merger or assignee", () => {
  const prs = normalizePullRequests(
    [pr(), pr({ user: { login: "other" } })],
    "pcodesdev"
  );
  const issues = normalizeIssues(
    [
      issue(),
      issue({ user: { login: "other" } }),
      {
        ...issue({ number: 10 }),
        pull_request: { url: "https://api.github.com/pr/10" },
      },
    ],
    "pcodesdev"
  );

  expect(prs).toHaveLength(1);
  expect(prs[0].state).toBe("merged");
  expect(prs[0].changedFiles).toBe(2);
  expect(issues).toHaveLength(1);
  expect(issues[0].author).toBe("pcodesdev");
});

test("aggregate counts keep commits, PRs, issues, and owned repository stars distinct", () => {
  const snapshot = buildGitHubSnapshot({
    profile: { login: "pcodesdev", id: 1, name: "Peter", public_repos: 2 },
    repositories: [
      {
        owner: { login: "pcodesdev" },
        stargazers_count: 5,
        forks_count: 2,
        fork: false,
      },
      {
        owner: { login: "pcodesdev" },
        stargazers_count: 3,
        forks_count: 1,
        fork: true,
      },
      {
        owner: { login: "other" },
        stargazers_count: 20,
        forks_count: 9,
        fork: false,
      },
    ],
    pullRequests: [pr()],
    issues: [issue()],
    prTotal: 4,
    issueTotal: 6,
    issueOpenTotal: 2,
    issueClosedTotal: 4,
    commitSearchMatches: 12,
    contributionCalendar: {
      totalContributions: 10,
      totalCommitContributions: 7,
      weeks: [],
    },
    fetchedAt: "2026-11-05T00:00:00Z",
  });

  expect(snapshot.profile.login).toBe("pcodesdev");
  expect(snapshot.summary).toMatchObject({
    publicRepositories: 2,
    ownedRepositoryStars: 8,
    ownedRepositoryForks: 3,
    ownedRepositoriesIncludedInStarTotal: 2,
    commitSearchMatches: 12,
    commitsLastYear: 7,
    contributionCalendarTotal: 10,
    pullRequests: 4,
    pullRequestsMerged: 1,
    issues: 6,
    issuesOpen: 2,
    issuesClosed: 4,
  });
  expect(snapshot.repositoryContributions).toHaveLength(1);
  expect(snapshot.freshness).toBe("live");
});

test("repository contribution counts reflect only returned author-filtered records", () => {
  const repositories = summarizeRepositoryContributions(
    normalizePullRequests([pr()], "pcodesdev"),
    normalizeIssues([issue()], "pcodesdev")
  );
  expect(repositories).toEqual([
    expect.objectContaining({
      repository: "example/repo",
      pullRequests: 1,
      issues: 1,
    }),
  ]);
});

test("REST pagination normalization concatenates page results without altering records", () => {
  expect(
    normalizeGitHubPages([[pr({ number: 1 })], [pr({ number: 2 })]])
  ).toHaveLength(2);
});

test("GitHub search documents contain only the verified account's stats and authored record links", () => {
  const snapshot = buildGitHubSnapshot({
    profile: { login: "pcodesdev", id: 44283776, public_repos: 1 },
    repositories: [
      {
        owner: { login: "pcodesdev" },
        stargazers_count: 2,
        forks_count: 1,
        fork: false,
      },
    ],
    pullRequests: [pr(), pr({ number: 8, user: { login: "someone-else" } })],
    issues: [issue(), issue({ number: 10, user: { login: "someone-else" } })],
    prTotal: 1,
    issueTotal: 1,
    issueOpenTotal: 0,
    issueClosedTotal: 1,
    commitSearchMatches: 12,
  });
  const documents = snapshotToKnowledgeDocuments(snapshot);

  expect(
    documents.find((item) => item.id === "github-profile-summary").content
  ).toContain("12 public commit-search matches");
  expect(
    documents
      .filter((item) => item.id.startsWith("pr-"))
      .map((item) => item.externalUrl)
  ).toEqual(["https://github.com/example/repo/pull/7"]);
  expect(
    documents
      .filter((item) => item.id.startsWith("issue-"))
      .map((item) => item.externalUrl)
  ).toEqual(["https://github.com/example/repo/issues/9"]);
});
