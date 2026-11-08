# Dependency Modernization Audit

Audit date: 2026-11-08. Results reflect the existing lockfile and npm advisory database at the time of the audit.

## Security

- `npm audit --omit=dev` reported zero vulnerabilities.
- The full dependency tree reported 18 vulnerabilities: 13 low, 3 moderate, and 2 high. The high-severity findings are in `webpack-dev-server` and `webpack-dev-middleware`, both part of the development toolchain. The development server is bound to localhost by the current start script; do not expose it to untrusted networks.
- Automated audit remediation proposes changing `react-scripts` to `0.0.0` for some findings. That is not a usable upgrade; migrate the build tool and retest instead.
- The override for `deepmerge` 4.3.1 does not eliminate the low-severity advisory reported by the current audit.

## Versions and Migration

- The installed React and React DOM versions are 16.14.0; the application and tests use the legacy render API. Upgrade React and React DOM together, migrate the application entry point and tests, and validate component-library peer dependencies.
- `react-scripts` 5.0.1 is an aging Create React App build stack. Replace it with a maintained build tool in a dedicated migration, preserving hash routing, lazy loading, environment variables, public assets, production URLs, service-worker behavior, test setup, and deployment verification.
- React Router 5.3.4, React Bootstrap 1.6.8, Base Web 9.116.3, styled-components 5.3.11, Chart.js 2.9.4, and react-chartjs-2 2.11.2 each have newer major versions. Their APIs and peer requirements must be migrated and tested rather than installed blindly. Chart.js and react-chartjs-2 must be upgraded as a compatible pair.
- The Dockerfile uses Node 13.12.0, an unsupported runtime. Update and validate the container and Compose configuration together, including dependency installation and network binding. Local development documentation currently specifies Node 20; choose a supported LTS runtime and verify it across the app, scripts, CI, and container before changing the documented baseline.
- The npm audit and outdated checks do not prove packages are unused or that major upgrades are compatible. No major dependency upgrades were applied by this audit.

## Validation Baseline

- React suite: 28 suites and 98 tests passed.
- Curation, deployment, and image suite: 49 tests passed.
- Production build compiled successfully using a temporary output directory. The existing build directory produced an `UNKNOWN: unknown error, read` error on this OneDrive-backed workspace.