const askPortfolio = require("../../api/ask");

let originalFetch;
let originalEnvironment;

function mockResponse() {
  return {
    headers: {},
    statusCode: 0,
    body: "",
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body = "") {
      this.body = body;
    },
  };
}

function request(question, overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://portfolio.example",
      "x-vercel-forwarded-for": "203.0.113.7",
    },
    body: { question },
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides,
  };
}

function mockRedis(count = 1) {
  global.fetch = jest.fn(async (url) => {
    if (String(url).endsWith("/pipeline")) {
      return { ok: true, json: async () => [{ result: [count, 60] }] };
    }
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: "Grounded answer.",
                sourceIds: ["ai-engineering-expertise", "untrusted-id"],
              }),
            },
          },
        ],
      }),
    };
  });
}

beforeEach(() => {
  originalFetch = global.fetch;
  originalEnvironment = { ...process.env };
  process.env.PORTFOLIO_SEARCH_ALLOWED_ORIGIN = "https://portfolio.example";
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "server-only-redis-test-token";
  process.env.OPENAI_API_KEY = "server-only-provider-test-key";
  process.env.OPENAI_MODEL = "test-model";
});

afterEach(() => {
  if (originalFetch === undefined) delete global.fetch;
  else global.fetch = originalFetch;
  Object.keys(process.env).forEach((key) => {
    if (!(key in originalEnvironment)) delete process.env[key];
  });
  Object.assign(process.env, originalEnvironment);
});

test("returns a grounded answer with only retrieved, allowlisted source references", async () => {
  mockRedis();
  const response = mockResponse();
  await askPortfolio(
    request("What are Peter's AI engineering skills?"),
    response
  );

  expect(response.statusCode).toBe(200);
  const payload = JSON.parse(response.body);
  expect(payload.answer).toBe("Grounded answer.");
  expect(payload.sources.length).toBeGreaterThan(0);
  expect(payload.sources.every((source) => source.id !== "untrusted-id")).toBe(
    true
  );
  expect(payload.sources.every((source) => source.url.startsWith("/#/"))).toBe(
    true
  );
  expect(response.body).not.toContain("server-only-provider-test-key");

  const providerRequest = global.fetch.mock.calls.find(
    ([url]) => !String(url).endsWith("/pipeline")
  );
  const providerBody = JSON.parse(providerRequest[1].body);
  expect(providerRequest[1].headers.Authorization).toBe(
    "Bearer server-only-provider-test-key"
  );
  expect(providerBody.messages[0].content).toContain("untrusted data");
  expect(providerBody.messages[1].content).toContain(
    "Approved public portfolio excerpts"
  );
});

test("abstains if generated answer lacks a valid retrieved source reference", async () => {
  global.fetch = jest.fn(async (url) => {
    if (String(url).endsWith("/pipeline")) {
      return { ok: true, json: async () => [{ result: [1, 60] }] };
    }
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: "Unsupported claim.",
                sourceIds: ["not-in-retrieval"],
              }),
            },
          },
        ],
      }),
    };
  });
  const response = mockResponse();
  await askPortfolio(
    request("What are Peter's AI engineering skills?"),
    response
  );

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toEqual({ answer: "", sources: [] });
});

test("rejects disallowed origins and missing questions", async () => {
  const denied = mockResponse();
  await askPortfolio(
    request("skills", { headers: { origin: "https://attacker.example" } }),
    denied
  );
  expect(denied.statusCode).toBe(403);

  const missing = mockResponse();
  await askPortfolio(request("   "), missing);
  expect(missing.statusCode).toBe(400);
});

test("enforces the shared rate limit before calling the AI provider", async () => {
  mockRedis(9);
  const response = mockResponse();
  await askPortfolio(request("Tell me about project management"), response);

  expect(response.statusCode).toBe(429);
  expect(response.headers["retry-after"]).toBe("60");
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("fails closed when durable rate-limit storage is not configured", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  const fetchSpy = jest.fn();
  global.fetch = fetchSpy;
  const response = mockResponse();
  await askPortfolio(request("Tell me about experience"), response);

  expect(response.statusCode).toBe(503);
  expect(fetchSpy).not.toHaveBeenCalled();
});

test("returns a no-match response without calling the model for unsupported questions", async () => {
  mockRedis();
  const response = mockResponse();
  await askPortfolio(request("What is Peter's favorite black hole?"), response);

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toEqual({ answer: "", sources: [] });
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
