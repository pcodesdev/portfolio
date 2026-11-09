import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Publishes a built site to the GitHub Pages repository (pcodesdev/pcodesdev.github.io, branch main).
// Pages serves committed files, so the previous deployment is always one commit behind and
// every failure path below leaves the remote at its last known-good commit.
const DEFAULT_REPO = "https://github.com/pcodesdev/pcodesdev.github.io.git";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArguments(argv) {
  const options = {
    source: "build",
    repo: DEFAULT_REPO,
    branch: "main",
    verifyUrl: "",
    verifyTimeoutMs: 600000,
    verifyIntervalMs: 15000,
    verifyImages: false,
    message: "Deploy portfolio build",
  };
  const names = {
    "--source": "source",
    "--repo": "repo",
    "--branch": "branch",
    "--verify-url": "verifyUrl",
    "--verify-timeout-ms": "verifyTimeoutMs",
    "--verify-interval-ms": "verifyIntervalMs",
    "--message": "message",
  };
  for (let index = 0; index < argv.length; ) {
    if (argv[index] === "--verify-images") {
      options.verifyImages = true;
      index += 1;
      continue;
    }
    const key = names[argv[index]];
    if (!key || argv[index + 1] === undefined) {
      throw new Error(`Unknown or incomplete argument: ${argv[index]}`);
    }
    options[key] = argv[index + 1];
    index += 2;
  }
  options.verifyTimeoutMs = Number(options.verifyTimeoutMs);
  options.verifyIntervalMs = Number(options.verifyIntervalMs);
  return options;
}

function gitEnvironment() {
  const environment = {
    ...process.env,
    GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || "github-actions[bot]",
    GIT_AUTHOR_EMAIL:
      process.env.GIT_AUTHOR_EMAIL ||
      "41898282+github-actions[bot]@users.noreply.github.com",
    GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || "github-actions[bot]",
    GIT_COMMITTER_EMAIL:
      process.env.GIT_COMMITTER_EMAIL ||
      "41898282+github-actions[bot]@users.noreply.github.com",
  };
  if (process.env.CI) environment.GIT_TERMINAL_PROMPT = "0";
  const token = process.env.PAGES_DEPLOY_TOKEN;
  if (token) {
    // Passed through the environment so the credential never appears in argv, remotes, or logs.
    const header = Buffer.from(`x-access-token:${token}`).toString("base64");
    if (process.env.GITHUB_ACTIONS === "true")
      console.log(`::add-mask::${header}`);
    environment.GIT_CONFIG_COUNT = "1";
    environment.GIT_CONFIG_KEY_0 = "http.https://github.com/.extraheader";
    environment.GIT_CONFIG_VALUE_0 = `AUTHORIZATION: basic ${header}`;
  }
  return environment;
}

function git(args, { cwd, environment }) {
  return execFileSync("git", args, {
    cwd,
    env: environment,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function validateBuild(source) {
  const indexPath = path.join(source, "index.html");
  const manifestPath = path.join(source, "asset-manifest.json");
  if (!fs.existsSync(indexPath) || !fs.existsSync(manifestPath)) {
    throw new Error(
      `Refusing to deploy: ${source} is not a complete build (index.html or asset-manifest.json missing)`
    );
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const mainBundle = manifest.files && manifest.files["main.js"];
  if (
    !mainBundle ||
    !fs.existsSync(path.join(source, mainBundle.replace(/^\//, "")))
  ) {
    throw new Error(
      "Refusing to deploy: the main JavaScript bundle named in asset-manifest.json is missing"
    );
  }
  if (!/static\/js\//.test(fs.readFileSync(indexPath, "utf8"))) {
    throw new Error(
      "Refusing to deploy: index.html does not reference the JavaScript bundle"
    );
  }
  return mainBundle;
}

function replaceManagedFiles(source, site) {
  // Hashed bundles are replaced wholesale; unrelated files in the Pages repository are left alone.
  fs.rmSync(path.join(site, "static"), { recursive: true, force: true });
  fs.readdirSync(site)
    .filter((name) => /^precache-manifest\..*\.js$/.test(name))
    .forEach((name) => fs.rmSync(path.join(site, name), { force: true }));
  fs.cpSync(source, site, { recursive: true, force: true });
}

async function waitForLive(baseUrl, mainBundle, timeoutMs, intervalMs) {
  const root = baseUrl.replace(/\/$/, "");
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const response = await fetch(
        `${root}/asset-manifest.json?cb=${Date.now()}`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );
      if (response.ok) {
        const manifest = await response.json();
        if (manifest.files && manifest.files["main.js"] === mainBundle) {
          const bundle = await fetch(`${root}${mainBundle}?cb=${Date.now()}`);
          if (bundle.ok) return true;
        }
      }
    } catch (error) {
      // Not reachable yet; keep polling until the deadline.
    }
    if (Date.now() + intervalMs > deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

function featuredLocalImagePaths() {
  const projectData = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "src/shared/opensource/projects.json"),
      "utf8"
    )
  ).data;
  const publicationData = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "src/shared/medium/publications.json"),
      "utf8"
    )
  ).data;
  const paths = new Set();
  [...projectData, ...publicationData].forEach((item) => {
    const meta = item.imageMeta || {};
    [
      item.image,
      item.fallbackImage,
      meta.src,
      ...String(meta.srcSet || "")
        .split(",")
        .map((entry) => entry.trim().split(/\s+/)[0]),
    ]
      .filter((value) => value && value.startsWith("/"))
      .forEach((value) => paths.add(value));
  });
  return [...paths];
}

async function waitForLiveImages(baseUrl, timeoutMs, intervalMs) {
  const root = baseUrl.replace(/\/$/, "");
  const imagePaths = featuredLocalImagePaths();
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const available = await Promise.all(
      imagePaths.map(async (imagePath) => {
        try {
          const response = await fetch(`${root}${imagePath}?cb=${Date.now()}`, {
            headers: { Range: "bytes=0-0", "Cache-Control": "no-cache" },
            signal: AbortSignal.timeout(15000),
          });
          const valid =
            response.ok &&
            (response.headers.get("content-type") || "").startsWith("image/");
          if (response.body) await response.body.cancel();
          return valid;
        } catch (error) {
          return false;
        }
      })
    );
    if (available.every(Boolean)) return { ok: true, count: imagePaths.length };
    if (Date.now() + intervalMs > deadline)
      return { ok: false, count: imagePaths.length };
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

function report(outcome, detail) {
  console.log(`Deployment outcome: ${outcome}${detail ? ` (${detail})` : ""}`);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `deploy_outcome=${outcome}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Live deployment\n- Outcome: **${outcome}**${
        detail ? `\n- ${detail}` : ""
      }\n`
    );
  }
}

async function deploy(options) {
  const source = path.resolve(options.source);
  const mainBundle = validateBuild(source);
  const environment = gitEnvironment();
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pages-deploy-"));
  const site = path.join(workspace, "site");
  try {
    git(
      [
        "clone",
        "--quiet",
        "--single-branch",
        "--branch",
        options.branch,
        "--depth",
        "20",
        options.repo,
        site,
      ],
      { cwd: workspace, environment }
    );
    const previousCommit = git(["rev-parse", "HEAD"], {
      cwd: site,
      environment,
    });

    replaceManagedFiles(source, site);
    git(["add", "-A"], { cwd: site, environment });
    if (!git(["status", "--porcelain"], { cwd: site, environment })) {
      report(
        "no-change",
        `live site already matches the build at ${previousCommit.slice(0, 7)}`
      );
      return 0;
    }
    git(["commit", "--quiet", "-m", options.message], {
      cwd: site,
      environment,
    });
    const deployedCommit = git(["rev-parse", "HEAD"], {
      cwd: site,
      environment,
    });
    // A plain (non-force) push: a concurrent change to the Pages repo makes this fail instead of overwriting.
    git(["push", "--quiet", "origin", `HEAD:${options.branch}`], {
      cwd: site,
      environment,
    });
    console.log(
      `Pushed ${deployedCommit.slice(0, 7)} to ${
        options.branch
      } (previous ${previousCommit.slice(0, 7)})`
    );

    if (!options.verifyUrl) {
      report(
        "deployed",
        `commit ${deployedCommit.slice(0, 7)}; live verification skipped`
      );
      return 0;
    }
    const live = await waitForLive(
      options.verifyUrl,
      mainBundle,
      options.verifyTimeoutMs,
      options.verifyIntervalMs
    );
    const images =
      live && options.verifyImages
        ? await waitForLiveImages(
            options.verifyUrl,
            options.verifyTimeoutMs,
            options.verifyIntervalMs
          )
        : { ok: true, count: 0 };
    if (live && images.ok) {
      const imageDetail = options.verifyImages
        ? ` and ${images.count} featured image URLs`
        : "";
      report(
        "deployed",
        `commit ${deployedCommit.slice(0, 7)} verified live${imageDetail} at ${
          options.verifyUrl
        }`
      );
      return 0;
    }
    git(["revert", "--no-edit", "--no-commit", deployedCommit], {
      cwd: site,
      environment,
    });
    git(
      [
        "commit",
        "--quiet",
        "-m",
        `Revert ${options.message}: live verification failed`,
      ],
      {
        cwd: site,
        environment,
      }
    );
    git(["push", "--quiet", "origin", `HEAD:${options.branch}`], {
      cwd: site,
      environment,
    });
    const failure = live
      ? "featured image verification failed"
      : "bundle verification failed";
    report(
      "rolled-back",
      `${failure}; restored the tree of ${previousCommit.slice(0, 7)}`
    );
    return 1;
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
}

deploy(parseArguments(process.argv.slice(2)))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    const message = String(error.stderr || error.message || error).trim();
    console.error(
      `Deployment failed; the live site was not changed by this run: ${message}`
    );
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, "deploy_outcome=failed\n");
    }
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        "## Live deployment\n- Outcome: **failed** (previous live version preserved)\n"
      );
    }
    process.exitCode = 1;
  });
