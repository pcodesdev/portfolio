import { createGlobalStyle } from "styled-components";
import { statusPalette } from "./theme";

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-background: ${({ theme }) => theme.body};
    --color-surface: ${({ theme }) => theme.body};
    --color-primary: ${({ theme }) => theme.dark};
    --color-primary-hover: ${({ theme }) =>
      theme.imageHighlight || theme.highlight};
    --color-text-primary: ${({ theme }) => theme.text};
    --color-text-secondary: ${({ theme }) => theme.secondaryText};
    --color-border: ${({ theme }) => `${theme.text}33`};
    --color-accent: ${({ theme }) => theme.imageHighlight || theme.highlight};
    --color-success: ${statusPalette.success};
    --color-success-bg: ${statusPalette.successBackground};
    --color-error: ${statusPalette.error};
    --color-error-bg: ${statusPalette.errorBackground};
    --color-merged: ${statusPalette.merged};
    --color-merged-bg: ${statusPalette.mergedBackground};
    --color-status-text: ${statusPalette.text};
    --color-warning: ${statusPalette.warning};
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    background: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    transition: all 0.25s linear;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
`;
