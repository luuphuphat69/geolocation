const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log('Connected to MongoDB');

    app.listen(PORT, HOST, () => {
      console.log(`App listening on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();