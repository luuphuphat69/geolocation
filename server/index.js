const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();