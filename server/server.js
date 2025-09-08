const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const router = require('./router/router');

const app = express();
const CLIENT_BASE = "https://www.geolocation.space";

const allowedOrigins = [
  "https://www.geolocation.space",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
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
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));

app.use('/v1', router);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;