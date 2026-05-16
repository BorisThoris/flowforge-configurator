# FlowForge Configurator

A legacy React 16 portfolio demo for configuring pipeline-style records through a stateful form workflow. The app demonstrates Redux + thunk data loading, form state persistence, tag editing, custom select controls, and i18n-driven labels.

## What it shows

- React component composition around a multi-field configuration form.
- Redux, Redux Thunk, and Reduxsauce action/reducer organization.
- Local draft persistence with `localStorage`.
- Tag management with duplicate/empty/max-count validation.
- Language switching through `i18next` and `react-i18next`.
- API-facing service boundaries for loading channels and saving a transformed pipeline object.

## Tech stack

- React 16
- Redux, Redux Thunk, Reduxsauce
- i18next
- Create React App

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

The demo is self-contained: channel data and save/update responses are mocked in the Redux operations layer, so no backend or `json-server` process is required. The npm scripts set the legacy Create React App environment flags needed for modern Node versions.

## Verify

```bash
npm run build
```

## Legacy note

This is an older demo project that has been preserved and reframed as a personal portfolio sample. It is not intended to represent a current production stack.

## Cloudflare Pages

- Pages project name: `flowforge-configurator`
- GitHub repository: `BorisThoris/flowforge-configurator`
- Production branch: `master`
- Root directory: `.`
- Build command: `SKIP_PREFLIGHT_CHECK=true NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build`
- Build output directory: `build`
- Public URL target: `https://flowforge-configurator.pages.dev/`

Do not enable Cloudflare Access for the demo deployment. Leave frame-blocking headers unset so the portfolio can iframe the public build.
