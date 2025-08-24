const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router/router');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [process.env.CLIENT_BASE],
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
app.get('/health', (req, res) => res.send('OK'));

module.exports = app;