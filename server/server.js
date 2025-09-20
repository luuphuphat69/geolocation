const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' }); 
const router = require('./router/router');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit'); // import helper
const requestIp = require('request-ip');
const app = express();

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

app.use(requestIp.mw());
// app.use(rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 30, // limit each IP to 30 requests per windowMs
//   keyGenerator: (req, res) => {
//     return req.clientIp // IP address from requestIp.mw(), as opposed to req.ip
//   }
// }));

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  keyGenerator: (req, res) => ipKeyGenerator(req), // safe for IPv6
}));

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