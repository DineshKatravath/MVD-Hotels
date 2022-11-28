const mongoose = require("mongoose");

var mongoURL =
  "mongodb+srv://Dinesh:Dinesh@cluster0.bxzys.mongodb.net/mvd-hotels";

mongoose.connect(mongoURL, {
  /*useUnifiedToplology : true ,*/ useNewUrlParser: true,
});

var connection = mongoose.connection;

connection.on("error", () => {
  console.log("MongoDB Connection Failed....");
});

connection.on("connected", () => {
  console.log("MongoDB Connection Successful....");
});

module.exports = mongoose;
