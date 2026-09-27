// Metadata inputs for this repository - unique to quick-base-task.
//
// Everything here is curated by hand: identity, commands, the screenshot recipe
// (capture), the recorded trailer (trailers.items, kind: capture) and where the
// card, icons and trailers are published. scripts/generate-project-meta.mjs
// derives the rest into project.meta.json; scripts/project-media.test.mjs
// checks that everything here was actually produced.
//   npm run meta:refresh   trailers -> shots -> social -> icons -> meta
//   npm run test:media     the media contract

import path from 'node:path';

const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  "slug": "flowforge-configurator",
  "classification": "web-app",
  "curated": {
    "title": "Flowforge Configurator",
    "subtitle": "A pipeline configuration form with drafts and tags",
    "description": "A React and Redux configuration form for pipeline-style records: load channels, edit fields and tags with validation, keep a local draft between visits, switch languages, and save a transformed pipeline object through a mocked API.",
    "tags": [
      "React",
      "Redux",
      "Forms",
      "i18next"
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
  "capture": {
    "route": "/",
    "actions": [
      {
        "type": "click",
        "target": {
          "role": "button",
          "name": "Edit tags"
        },
        "label": "open the tag editor",
        "optional": true
      },
      {
        "type": "wait",
        "ms": 800
      }
    ],
    "waitAfterReadyMs": 600
  },
  "scores": {
    "priorityScore": 61,
    "demoabilityScore": 64,
    "depthScore": 62,
    "polishScore": 62,
    "uniquenessScore": 60,
    "maintenanceScore": 56
  },
  "analysisNotes": "React/Redux configuration UI with mock flows; build fallback is reliable while its old CRA dev server is less stable locally.",
  "social": {
    "htmlFile": "public/index.html",
    "pageTitle": "Flowforge Configurator",
    "staticDir": "public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },
  "icons": {
    "background": "#042f2e",
    "themeColor": "#042f2e",
    "shortName": "Flowforge"
  },
  "media": {
    "sourceDir": path.join(portfolioRoot, "public", "project-shots", "flowforge-configurator", "latest"),
    "publicPathPrefix": "/project-shots/flowforge-configurator/latest",
    "primaryProfile": "card"
  },
  "trailers": {
    "items": [
      {
        "id": "tour",
        "title": "Flowforge Configurator: a pipeline, saved",
        "kind": "capture",
        "inputs": [
          "src",
          "public/index.html"
        ],
        "source": "deployment",
        "music": "project-media/music/tour.m4a",
        "posterAt": 0.5,
        "recipe": {
          "route": "/",
          "viewport": {
            "width": 1280,
            "height": 720
          },
          "durationMs": 20000,
          "setup": {
            "actions": [
              {
                "type": "waitFor",
                "target": {
                  "role": "button",
                  "name": "Save pipeline"
                },
                "state": "visible",
                "label": "wait for the form"
              }
            ],
            "waitAfterReadyMs": 1200
          },
          "timeline": [
            {
              "type": "fill",
              "target": {
                "selector": "input[type=text]"
              },
              "value": "",
              "label": "clear the label",
              "optional": true
            },
            {
              "type": "type",
              "target": {
                "selector": "input[type=text]"
              },
              "value": "Nightly export",
              "eachMs": 90,
              "label": "name the pipeline",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 1200
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Edit tags"
              },
              "label": "edit tags",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 2500
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Switch language"
              },
              "label": "switch language",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 2500
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Switch language"
              },
              "label": "switch back",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 1500
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Save pipeline"
              },
              "label": "save",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3000
            }
          ]
        }
      }
    ]
  }
};
