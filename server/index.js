const mongoose = require('mongoose');
const app = require('./server');

const PORT = 3000;

(async () => {
  try {
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected! Reconnecting...");
      connectDB();
    });
    connectDB();
    
    app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

function connectDB() {
  mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
      console.error("MongoDB connection error:", err);
      setTimeout(connectDB, 5000); // retry after 5s
    });
}

