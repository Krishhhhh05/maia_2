"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const url = process.env.db_url;
console.log("trying to connect to db...  " + process.env.NODE_ENV + " " + url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var mongoConn = mongoose.connection;

mongoConn.on("error", console.error.bind(console, "Connection error: "));
mongoConn.once("open", function (callback) {
  console.log("Successfully connected to MongoDB /.");
});

autoIncrement.initialize(mongoConn);

module.exports = mongoConn;
