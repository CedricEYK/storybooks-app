const mongoose = require("mongoose");

// * connecting Atlas with async/await and adding callback for app.listen
const connectMongoDBAtlas = async (listenForPort) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    listenForPort();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectMongoDBAtlas;
