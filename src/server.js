import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import App from './App';
import configureStore from './store';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();
const store = configureStore();
const sheet = new ServerStyleSheet();

const isProduction = process.env.NODE_ENV === 'production';

server.disable('x-powered-by');
server.use(express.static(process.env.RAZZLE_PUBLIC_DIR));

server.get('/api/health', (req, res) => {
  res.status(200).json({ health: '😊' });
});

// TODO: Clean up and split up all the different logic handling styled-components, variables set on window object, etc
server.get('/*', (req, res) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <Provider store={store}>
        <StyleSheetManager sheet={sheet.instance}>
          <App />
        </StyleSheetManager>
      </Provider>
    </StaticRouter>
  );

  const styleTags = sheet.getStyleTags();

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(
      `<!doctype html>
      <html lang="">
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Estafet Boost</title>
          <meta name="theme-color" content="#2BA2B8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
          ${styleTags}
          ${
            isProduction
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
        </head>
        <body>
          <div id="root">${markup}</div>
          <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())};
            window.boost = ${JSON.stringify({
              BUILD_API_SERVICE_URI: process.env.BUILD_API_SERVICE_URI,
              TEST_API_SERVICE_URI: process.env.TEST_API_SERVICE_URI,
              PROD_API_SERVICE_URI: process.env.PROD_API_SERVICE_URI,
            })};
          </script>
        </body>
      </html>`
    );
  }
});

export default server;
