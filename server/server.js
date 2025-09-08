const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router/router');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_BASE = "https://www.geolocation.space"
//const CLIENT_BASE = "http://localhost:5173"

const corsOptions = {
  origin: [CLIENT_BASE],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'x-client-key',
    'x-client-token',
    'x-client-secret',
    'Authorization'
  ],
};
app.use(cors(corsOptions));
app.use(morgan("common"));

// Routes
app.use('/v1', router);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;