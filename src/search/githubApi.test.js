const githubProfile = require("../../api/github");
const {
  verifyProfileIdentity,
  snapshotWithFreshness,
  fetchPages,
  searchAll,
  resetWarmCache,
} = githubProfile._test;

let originalFetch;
let originalEnvironment;

function response() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body = "") {
      this.body = body;
    },
  };
}

beforeEach(() => {
  originalFetch = global.fetch;
  originalEnvironment = { ...process.env };
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.PORTFOLIO_SEARCH_ALLOWED_ORIGIN = "https://portfolio.example";
  resetWarmCache();
});

afterEach(() => {
  if (originalFetch === undefined) delete global.fetch;
  else global.fetch = originalFetch;
  Object.keys(process.env).forEach((key) => {
    if (!(key in originalEnvironment)) delete process.env[key];
  });
  Object.assign(process.env, originalEnvironment);
  resetWarmCache();
});

test("verifies the GitHub identity by both login and account ID", () => {
  expect(verifyProfileIdentity({ login: "pcodesdev", id: 44283776 })).toBe(
    true
  );
  expect(verifyProfileIdentity({ login: "other", id: 44283776 })).toBe(false);
  expect(verifyProfileIdentity({ login: "pcodesdev", id: 7 })).toBe(false);
});

test("marks cache fresh, cached, or stale by the successful retrieval timestamp", () => {
  const snapshot = {
    retrievedAt: "2026-11-05T00:00:00.000Z",
    freshness: "live",
  };
  const now = Date.parse("2026-11-05T00:30:00.000Z");
  expect(snapshotWithFreshness(snapshot, now).freshness).toBe("cached");
  expect(
    snapshotWithFreshness(snapshot, now + 2 * 60 * 60 * 1000).freshness
  ).toBe("stale");
});

test("fetches and combines every REST page until a short page is reached", async () => {
  let calls = 0;
  global.fetch = jest.fn(async () => {
    calls += 1;
    return {
      ok: true,
      json: async () =>
        calls === 1
          ? Array.from({ length: 100 }, (_, index) => ({ id: index }))
          : [{ id: 100 }, { id: 101 }],
    };
  });

  const results = await fetchPages(
    (page) => `https://api.github.test/repos?page=${page}`
  );
  expect(results).toHaveLength(102);
  expect(calls).toBe(2);
});

test("falls back to the bundled snapshot and labels it stale when the GitHub request fails", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  global.fetch = jest.fn(async (url) => {
    if (String(url).endsWith("/pipeline")) {
      return { ok: true, json: async () => [{ result: null }] };
    }
    return { ok: false, status: 403, json: async () => ({}) };
  });
  const result = response();
  await githubProfile(
    {
      method: "GET",
      headers: {
        origin: "https://portfolio.example",
        "x-vercel-forwarded-for": "203.0.113.1",
      },
      socket: { remoteAddress: "127.0.0.1" },
    },
    result
  );

  expect(result.statusCode).toBe(200);
  const payload = JSON.parse(result.body);
  expect(payload.profile.login).toBe("pcodesdev");
  expect(payload.freshness).toBe("stale");
  expect(payload.warning).toMatch(/refresh failed/i);
});

test("search pagination continues while reported author-filtered matches remain", async () => {
  let pageNumber = 0;
  global.fetch = jest.fn(async () => {
    pageNumber += 1;
    return {
      ok: true,
      json: async () => ({
        total_count: 101,
        items:
          pageNumber === 1
            ? Array.from({ length: 100 }, (_, index) => ({ id: index }))
            : [{ id: 100 }],
      }),
    };
  });

  const result = await searchAll("author:pcodesdev type:issue");
  expect(result.total).toBe(101);
  expect(result.items).toHaveLength(101);
  expect(pageNumber).toBe(2);
});

test("returns the bundled snapshot with a stale label when persistent cache is not configured", async () => {
  const result = response();
  await githubProfile(
    {
      method: "GET",
      headers: { origin: "https://portfolio.example" },
      socket: { remoteAddress: "127.0.0.1" },
    },
    result
  );

  expect(result.statusCode).toBe(200);
  const payload = JSON.parse(result.body);
  expect(payload.profile.login).toBe("pcodesdev");
  expect(payload.freshness).toBe("stale");
  expect(payload.warning).toMatch(/Persistent cache is not configured/);
});

test("rejects unknown origins and unsupported methods", async () => {
  const denied = response();
  await githubProfile(
    { method: "GET", headers: { origin: "https://other.example" } },
    denied
  );
  expect(denied.statusCode).toBe(403);

  const method = response();
  await githubProfile(
    { method: "POST", headers: { origin: "https://portfolio.example" } },
    method
  );
  expect(method.statusCode).toBe(405);
});

test("rate limiting returns the bundled snapshot with an explicit stale label", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  global.fetch = jest.fn(async (_url, options) => {
    const command = JSON.parse(options.body)[0][0];
    return {
      ok: true,
      json: async () => [{ result: command === "GET" ? null : 13 }],
    };
  });
  const result = response();
  await githubProfile(
    {
      method: "GET",
      headers: {
        origin: "https://portfolio.example",
        "x-vercel-forwarded-for": "203.0.113.1",
      },
      socket: { remoteAddress: "127.0.0.1" },
    },
    result
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["retry-after"]).toBe("60");
  expect(JSON.parse(result.body).freshness).toBe("stale");
  expect(JSON.parse(result.body).warning).toContain("rate limit");
});
