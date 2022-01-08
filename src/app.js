require("./db/mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./config/dev.env") });
const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app 