const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config({path: path.join(__dirname, "../config/dev.env")});



mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});















