import React, { useEffect, useMemo, useRef, useState } from "react";
import { makeLocalAnswer, retrieve } from "../../search/retrieval";
import {
  buildSuggestionGroups,
  rotateSuggestionGroups,
} from "../../search/suggestions";
import githubSnapshot from "../../shared/opensource/github_stats_snapshot.json";
import "./PortfolioSearch.css";
const { snapshotToKnowledgeDocuments } = require("../../search/github-data");

const AI_ENDPOINT =
  typeof window !== "undefined" &&
  typeof window.PORTFOLIO_SEARCH_ENDPOINT === "string"
    ? window.PORTFOLIO_SEARCH_ENDPOINT
    : "";

export default function PortfolioSearch({ theme, endpoint = AI_ENDPOINT }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [message, setMessage] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [knowledgeLoaded, setKnowledgeLoaded] = useState(false);
  const [suggestionOffset, setSuggestionOffset] = useState(() =>
    Math.floor(Date.now() / 86400000)
  );
  const [githubData, setGithubData] = useState(githubSnapshot);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const searchDocuments = useMemo(
    () => [...snapshotToKnowledgeDocuments(githubData), ...knowledgeBase],
    [githubData, knowledgeBase]
  );
  const suggestionGroups = useMemo(
    () => buildSuggestionGroups(searchDocuments),
    [searchDocuments]
  );
  const visibleSuggestionGroups = rotateSuggestionGroups(
    suggestionGroups,
    suggestionOffset,
    3
  );

  useEffect(() => {
    if (!isOpen || knowledgeLoaded) return undefined;
    let active = true;
    import("../../search/knowledge-base.json")
      .then((module) => {
        if (!active) return;
        setKnowledgeBase(module.default || module);
        setKnowledgeLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setKnowledgeLoaded(true);
        setMessage("The portfolio search index could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [isOpen, knowledgeLoaded]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const githubEndpoint = window.PORTFOLIO_GITHUB_STATS_ENDPOINT;
    if (typeof githubEndpoint !== "string" || !githubEndpoint) return undefined;
    const controller = new AbortController();
    fetch(githubEndpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub refresh failed.");
        return response.json();
      })
      .then((payload) => {
        if (payload.profile?.login === "pcodesdev" && payload.summary)
          setGithubData(payload);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    if (inputRef.current) inputRef.current.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (openerRef.current) openerRef.current.focus();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), a[href]"
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const openSearch = (event) => {
    openerRef.current = event.currentTarget;
    setIsOpen(true);
    setMessage("");
  };

  const runSearch = async (event) => {
    event.preventDefault();
    const normalizedQuery = query.trim().slice(0, 600);
    if (!normalizedQuery) {
      setMessage("Enter a question or search phrase.");
      return;
    }
    if (!knowledgeLoaded) {
      setMessage("The portfolio search index is still loading.");
      return;
    }

    const localResults = retrieve(normalizedQuery, searchDocuments);
    const localSources = localResults.map(
      ({ id, title, url, externalUrl, content }) => ({
        id,
        title,
        url,
        externalUrl,
        excerpt: String(content).slice(0, 220),
      })
    );
    setSources(localSources);
    setAnswer(makeLocalAnswer(localResults) || "");
    setMessage(
      localResults.length
        ? ""
        : "No relevant information was found in the published portfolio."
    );

    if (!endpoint) {
      if (localResults.length) {
        setMessage(
          "Showing matching public portfolio content. AI answers are not connected in this build."
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: normalizedQuery }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.message || `Search service returned ${response.status}.`
        );
      }
      if (
        typeof payload.answer !== "string" ||
        !Array.isArray(payload.sources)
      ) {
        throw new Error("Search service returned an invalid answer.");
      }
      if (!payload.answer.trim() || !payload.sources.length) {
        setAnswer("");
        setSources([]);
        setMessage(
          "No relevant information was found in the published portfolio."
        );
        return;
      }
      setAnswer(payload.answer);
      setSources(payload.sources);
      setMessage(
        payload.sources.length
          ? "AI answer grounded in published portfolio sources."
          : "No relevant information was found in the published portfolio."
      );
    } catch (error) {
      setMessage(
        localResults.length
          ? "AI search is temporarily unavailable; showing matching portfolio content instead."
          : "Search is temporarily unavailable, and no relevant local content was found."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="portfolio-search-root"
      style={{
        "--portfolio-body": theme.body,
        "--portfolio-text": theme.text,
        "--portfolio-secondary": theme.secondaryText,
      }}
    >
      <button
        className="portfolio-search-open"
        type="button"
        onClick={openSearch}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className="iconify" data-icon="mdi:magnify" aria-hidden="true" />
        <span>Ask My Portfolio</span>
      </button>
      {isOpen ? (
        <div
          className="portfolio-search-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
              if (openerRef.current) openerRef.current.focus();
            }
          }}
        >
          <section
            ref={dialogRef}
            className="portfolio-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-search-title"
            aria-describedby="portfolio-search-subtitle"
          >
            <div className="portfolio-search-dialog-heading">
              <div>
                <h2 id="portfolio-search-title">Ask My Portfolio</h2>
                <p id="portfolio-search-subtitle">
                  Explore my experience, projects, skills, and professional
                  background using AI.
                </p>
              </div>
              <button
                className="portfolio-search-close"
                type="button"
                aria-label="Close portfolio search"
                onClick={() => {
                  setIsOpen(false);
                  if (openerRef.current) openerRef.current.focus();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <form className="portfolio-search-form" onSubmit={runSearch}>
              <label
                className="portfolio-search-label"
                htmlFor="portfolio-question"
              >
                Ask a question or search the public portfolio
              </label>
              <div className="portfolio-search-input-row">
                <input
                  ref={inputRef}
                  id="portfolio-question"
                  value={query}
                  maxLength={600}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ask about experience, skills, or projects..."
                  autoComplete="off"
                />
                <button type="submit" disabled={isLoading || !knowledgeLoaded}>
                  {isLoading ? "Searching…" : "Search"}
                </button>
              </div>
            </form>

            <section
              className="portfolio-search-suggestions"
              aria-label="Suggested questions by topic"
            >
              <div className="portfolio-search-suggestion-heading">
                <h3>Explore by topic</h3>
                <button
                  type="button"
                  onClick={() => setSuggestionOffset((offset) => offset + 3)}
                >
                  More topics
                </button>
              </div>
              {!knowledgeLoaded ? (
                <p className="portfolio-search-loading" role="status">
                  Loading portfolio search topics…
                </p>
              ) : (
                visibleSuggestionGroups.map((group) => (
                  <div
                    className="portfolio-search-suggestion-group"
                    key={group.id}
                  >
                    <h4>{group.label}</h4>
                    <div>
                      {group.questions.slice(0, 2).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setQuery(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </section>

            {isLoading ? (
              <p
                className="portfolio-search-loading"
                role="status"
                aria-live="polite"
              >
                Searching approved public portfolio content…
              </p>
            ) : null}
            {message ? (
              <p
                className="portfolio-search-message"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            ) : null}
            {answer ? (
              <section
                className="portfolio-search-answer"
                aria-labelledby="portfolio-answer-heading"
              >
                <h3 id="portfolio-answer-heading">
                  {endpoint ? "Answer" : "Matching portfolio information"}
                </h3>
                <p>{answer}</p>
                {sources.length ? (
                  <div className="portfolio-search-sources">
                    <h4>Sources</h4>
                    <ul>
                      {sources.map((source) => (
                        <li key={source.id}>
                          <a href={source.url}>{source.title}</a>
                          {source.externalUrl ? (
                            <a
                              href={source.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              External source
                            </a>
                          ) : null}
                          {source.excerpt ? <p>{source.excerpt}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
            <p className="portfolio-search-footnote">
              Searches public portfolio content only. Do not enter sensitive
              personal information.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
