// Metadata inputs for this repository - unique to quick-base-task.
//
// Everything here is curated by hand. Derived facts (stack, metrics, git,
// screenshots) are computed by scripts/generate-project-meta.mjs, which writes
// project.meta.json. Run it with:
//   npm run meta          regenerate project.meta.json
//   npm run meta:check    fail if project.meta.json is stale

import path from 'node:path';

// Screenshots are captured by the portfolio (npm run capture there). Point
// PORTFOLIO_ROOT elsewhere, or drop images in ./project-media, to override.
const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  slug: "flowforge-configurator",
  classification: "web-app",

  curated: {
    "title": "Flowforge Configurator",
    "subtitle": "Mocked configuration UI",
    "description": "A React/Redux configuration demo with local mocked save/update flows for a self-contained portfolio build.",
    "tags": [
      "React",
      "Redux",
      "Mock Data"
    ],
    "accent": "#14b8a6",
    "deploymentUrl": "https://flowforge-configurator-git.pages.dev/",
    "localUrl": "http://127.0.0.1:4112/",
    "buildCommand": "npm run build",
    "buildOutput": "build",
    "runCommand": "npm start",
    "devPort": 4112,
    "showcaseTier": "more"
  },

  // How the portfolio screenshot pipeline photographs this project.
  capture: {
    "route": "/"
  },

  scores: {
    "priorityScore": 61,
    "demoabilityScore": 64,
    "depthScore": 62,
    "polishScore": 62,
    "uniquenessScore": 60,
    "maintenanceScore": 56
  },

  analysisNotes:
    "React/Redux configuration UI with mock flows; build fallback is reliable while its old CRA dev server is less stable locally.",

  // Where the link-preview card lives: the page head that carries the Open
  // Graph tags, and the static directory the image is published from.
  social: {
    "htmlFile": "public/index.html",
    "staticDir": "public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },

  // The icon set is rendered from favicon.svg by scripts/generate-app-icons.mjs.
  icons: {
    "background": "#042f2e",
    "themeColor": "#042f2e",
    "shortName": "Flowforge"
  },

  media: {
    sourceDir: path.join(portfolioRoot, "public", "project-shots", "flowforge-configurator", "latest"),
    publicPathPrefix: "/project-shots/flowforge-configurator/latest",
    primaryProfile: "card"
  }
};
