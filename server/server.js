const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config();
const morgan = require('morgan');
const mongoURI = process.env.MONGODB_CONNECTION;
const port = 3000;
const router = require('./router/router');
const cors = require('cors');
const corsOptions = {
  origin: ["http://localhost:5173"],
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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
app.use('/v1', router);

(async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
})();
