import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const script = path.join(repoRoot, "scripts/deploy-live-site.mjs");
const identity = {
  GIT_AUTHOR_NAME: "test",
  GIT_AUTHOR_EMAIL: "test@example.com",
  GIT_COMMITTER_NAME: "test",
  GIT_COMMITTER_EMAIL: "test@example.com",
};

function git(args, cwd, extraEnv = {}) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...identity, ...extraEnv },
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function writeFiles(root, files) {
  Object.entries(files).forEach(([relative, content]) => {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  });
}

function buildFiles(mainBundle, extra = {}) {
  return {
    "index.html": `<html><script src="${mainBundle}"></script></html>`,
    "asset-manifest.json": JSON.stringify({ files: { "main.js": mainBundle } }),
    [mainBundle.replace(/^\//, "")]: "console.log('site')",
    ...extra,
  };
}

// A bare repository seeded with a previous deployment, standing in for pcodesdev/pcodesdev.github.io.
function createPagesRemote() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "deploy-test-"));
  const bare = path.join(root, "pages.git");
  const seed = path.join(root, "seed");
  git(["init", "--bare", "--initial-branch=main", bare], root);
  git(["init", "--initial-branch=main", seed], root);
  writeFiles(seed, {
    ...buildFiles("/static/js/main.old.chunk.js"),
    "favicon.ico": "ico",
    "static/js/stale.chunk.js": "stale",
    "precache-manifest.old.js": "old",
  });
  git(["add", "-A"], seed);
  git(["commit", "-m", "previous deployment"], seed);
  git(["push", bare, "main"], seed);
  const url = pathToFileURL(bare).href;
  return {
    root,
    bare,
    url,
    head: () => git(["--git-dir", bare, "rev-parse", "main"], root),
    tree: (ref = "main") =>
      git(["--git-dir", bare, "rev-parse", `${ref}^{tree}`], root),
    commits: () =>
      Number(git(["--git-dir", bare, "rev-list", "--count", "main"], root)),
    files: () =>
      git(
        ["--git-dir", bare, "ls-tree", "-r", "--name-only", "main"],
        root
      ).split("\n"),
    subjects: () =>
      git(["--git-dir", bare, "log", "--format=%s", "main"], root).split("\n"),
  };
}

function createBuild(mainBundle, extra) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deploy-build-"));
  writeFiles(dir, buildFiles(mainBundle, extra));
  return dir;
}

function deploy(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: repoRoot,
      env: {
        ...process.env,
        ...identity,
        GITHUB_ACTIONS: "",
        GITHUB_OUTPUT: "",
        GITHUB_STEP_SUMMARY: "",
        ...env,
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

function liveSite(
  manifestMain,
  { bundleStatus = 200, imageStatus = 200 } = {}
) {
  const server = http.createServer((request, response) => {
    if (request.url.startsWith("/asset-manifest.json")) {
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ files: { "main.js": manifestMain } }));
    } else if (request.url.startsWith("/images/")) {
      response.statusCode = imageStatus;
      response.setHeader("content-type", "image/svg+xml");
      response.end("<svg/>");
    } else {
      response.statusCode = bundleStatus;
      response.end("bundle");
    }
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((done) => server.close(done)),
      })
    )
  );
}

const NEW_BUNDLE = "/static/js/main.new.chunk.js";

test("deploys a valid build, replaces stale hashed assets, and keeps unrelated files", async () => {
  const remote = createPagesRemote();
  const build = createBuild(NEW_BUNDLE);
  const before = remote.commits();

  const result = await deploy(["--source", build, "--repo", remote.url]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(remote.commits(), before + 1);
  const files = remote.files();
  assert.ok(files.includes("static/js/main.new.chunk.js"));
  assert.ok(
    !files.includes("static/js/stale.chunk.js"),
    "stale hashed assets are removed"
  );
  assert.ok(!files.includes("precache-manifest.old.js"));
  assert.ok(files.includes("favicon.ico"), "unrelated files are preserved");
  assert.match(result.stdout, /Deployment outcome: deployed/);
});

test("deploys builds whose manifest lists an absolute main bundle URL", async () => {
  const remote = createPagesRemote();
  const build = createBuild(NEW_BUNDLE);
  const manifestPath = path.join(build, "asset-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.files["main.js"] =
    "https://pcodesdev.github.io/static/js/main.new.chunk.js";
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));

  const result = await deploy(["--source", build, "--repo", remote.url]);

  assert.equal(result.status, 0, result.stderr);
  assert.ok(remote.files().includes("static/js/main.new.chunk.js"));
  assert.match(result.stdout, /Deployment outcome: deployed/);
});

test("an unchanged build creates no commit", async () => {
  const remote = createPagesRemote();
  const build = createBuild(NEW_BUNDLE);
  assert.equal(
    (await deploy(["--source", build, "--repo", remote.url])).status,
    0
  );
  const head = remote.head();

  const second = await deploy(["--source", build, "--repo", remote.url]);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(remote.head(), head);
  assert.match(second.stdout, /Deployment outcome: no-change/);
});

test("an incomplete build is refused and the live repository is untouched", async () => {
  const remote = createPagesRemote();
  const head = remote.head();
  const build = createBuild(NEW_BUNDLE);
  fs.rmSync(path.join(build, "asset-manifest.json"));

  const result = await deploy(["--source", build, "--repo", remote.url]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /not a complete build/);
  assert.equal(remote.head(), head);

  const missingBundle = createBuild(NEW_BUNDLE);
  fs.rmSync(path.join(missingBundle, "static"), { recursive: true });
  const second = await deploy([
    "--source",
    missingBundle,
    "--repo",
    remote.url,
  ]);
  assert.equal(second.status, 1);
  assert.equal(remote.head(), head);
});

test("a rejected push fails the run and preserves the previous live version", async () => {
  const remote = createPagesRemote();
  const head = remote.head();
  const hook = path.join(remote.bare, "hooks", "pre-receive");
  fs.writeFileSync(
    hook,
    "#!/bin/sh\necho 'push rejected for test' >&2\nexit 1\n",
    { mode: 0o755 }
  );

  const result = await deploy([
    "--source",
    createBuild(NEW_BUNDLE),
    "--repo",
    remote.url,
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /push rejected for test/);
  assert.match(result.stderr, /live site was not changed/);
  assert.equal(remote.head(), head);
});

test("live verification succeeds when the new bundle is being served", async () => {
  const remote = createPagesRemote();
  const site = await liveSite(NEW_BUNDLE);
  try {
    const result = await deploy([
      "--source",
      createBuild(NEW_BUNDLE),
      "--repo",
      remote.url,
      "--verify-url",
      site.url,
      "--verify-timeout-ms",
      "3000",
      "--verify-interval-ms",
      "200",
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /verified live/);
  } finally {
    await site.close();
  }
});

test("featured image verification is part of the successful deployment transaction", async () => {
  const remote = createPagesRemote();
  const site = await liveSite(NEW_BUNDLE);
  try {
    const result = await deploy([
      "--source",
      createBuild(NEW_BUNDLE),
      "--repo",
      remote.url,
      "--verify-url",
      site.url,
      "--verify-images",
      "--verify-timeout-ms",
      "3000",
      "--verify-interval-ms",
      "200",
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /featured image URLs/);
    assert.match(result.stdout, /Deployment outcome: deployed/);
  } finally {
    await site.close();
  }
});

test("a live featured image failure rolls the deployment back to the previous tree", async () => {
  const remote = createPagesRemote();
  const previousTree = remote.tree();
  const site = await liveSite(NEW_BUNDLE, { imageStatus: 404 });
  try {
    const result = await deploy([
      "--source",
      createBuild(NEW_BUNDLE),
      "--repo",
      remote.url,
      "--verify-url",
      site.url,
      "--verify-images",
      "--verify-timeout-ms",
      "800",
      "--verify-interval-ms",
      "200",
    ]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /featured image verification failed/);
    assert.equal(
      remote.tree(),
      previousTree,
      "the prior live tree is restored after an image failure"
    );
    assert.match(remote.subjects()[0], /Revert .*live verification failed/);
  } finally {
    await site.close();
  }
});

test("failed live verification rolls the live repository back to the previous tree", async () => {
  const remote = createPagesRemote();
  const previousTree = remote.tree();
  const site = await liveSite("/static/js/main.old.chunk.js");
  try {
    const result = await deploy([
      "--source",
      createBuild(NEW_BUNDLE),
      "--repo",
      remote.url,
      "--verify-url",
      site.url,
      "--verify-timeout-ms",
      "800",
      "--verify-interval-ms",
      "200",
    ]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /Deployment outcome: rolled-back/);
    assert.equal(
      remote.tree(),
      previousTree,
      "the live tree must equal the last known-good tree"
    );
    assert.match(remote.subjects()[0], /Revert .*live verification failed/);
  } finally {
    await site.close();
  }
});

test("the deploy token is never printed", async () => {
  const remote = createPagesRemote();
  const secret = "synthetic-secret-value-for-test";
  const result = await deploy(
    ["--source", createBuild(NEW_BUNDLE), "--repo", remote.url],
    {
      PAGES_DEPLOY_TOKEN: secret,
    }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.ok(!result.stdout.includes(secret) && !result.stderr.includes(secret));
  assert.ok(
    !result.stdout.includes(
      Buffer.from(`x-access-token:${secret}`).toString("base64")
    )
  );
});
