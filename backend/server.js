require('dotenv').config()
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const port = process.env.PORT || 4000;

const app = express();
app.use(cors())

app.use(
  createProxyMiddleware({
    target: process.env.CAMUNDA_OPERATE_BASE_URL,
    changeOrigin: true,
    pathFilter: '**',
    logger: console
  }),
);

app.enable(cors);

app.listen(port, () => {console.log(`Server running on port ${port}`);});
