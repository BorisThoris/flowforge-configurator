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

The app expects channel-style data from the configured development proxy. For portfolio review, the core value is in the UI/state architecture and service boundary rather than a production backend.

## Legacy note

This is an older demo project that has been preserved and reframed as a personal portfolio sample. It is not intended to represent a current production stack.
