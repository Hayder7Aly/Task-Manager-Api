require("./db/mongoose");
const path = require("path")
require("dotenv").config({path: path.join(__dirname, "./config/dev.env")});
const express = require("express");
const userRouter = require("./routers/user")
const taskRouter = require('./routers/task')

const port = process.env.PORT;
const app = express();

// without express middleware: new request -> run route handler
// with middleware: new request -> do something -> run route handle

// "mongoose": "^5.3.16",


app.use(express.json());
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("Server is up on Port " + port);
  });



// *************  realtions ship with collection

// const Tasks = require("./models/task")

// const User = require("./models/user")

// const main = async () => {
//     // const task = await Tasks.findById("61d1bdb2f093c1180231cea6")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);

//     const user = await User.findById("61d1bbe5a476e313ae7d47c5")
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()



//   ************************ JWT 

// const jwt = require('jsonwebtoken')


// const myFunction = async () => {

//     const token = jwt.sign({ _id : "abc123" }, "thisismynewcourse", {expiresIn: "7 days"})
//     console.log(token);

//     const data = jwt.verify(token, "thisismynewcourse")
//     console.log(data);
// }

// myFunction()


