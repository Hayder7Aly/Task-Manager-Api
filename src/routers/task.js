const express = require("express");
const Tasks = require("../models/task");
const auth = require('../middleware/auth')

const taskRouter = new express.Router();

taskRouter.post("/tasks", auth, async (req, res) => {
  const task = new Tasks({
    ...req.body,
    owner : req.user._id
  })
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});


// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GEt /tasks?sortBy=createAt_asc

taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  const typeOfTasks = req.query.completed
  if(typeOfTasks){
    match.completed = typeOfTasks === "true"
  }
  if(req.query.sortBy){
    const parts = req.query.sortBy.split("_")
    sort[parts[0]] = parts[1]  === "desc" ? -1 : 1
  }
  
  try {
    // const tasks = await Tasks.find({owner : req.user._id});
    await req.user.populate({
      path : "tasks",
      match,
      options:{
        limit : parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks);
  } catch (err){
    res.status(500).send(err);
  }
});

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findOne({_id, owner : req.user._id})
    if(!task){
      return res.status(404).send()
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

taskRouter.patch("/tasks/:id",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
      const task = await Tasks.findOne({owner : req.user._id, _id:req.params.id})
      if(!task){
        return res.status(404).send()
      }
      updates.forEach(update => task[update] = req.body[update])
      await task.save()

     res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

taskRouter.delete("/tasks/:id",auth, async (req, res) => {
  try {
    // const deletedTask = await Tasks.findByIdAndDelete(req.params.id);
    const deletedTask = await Tasks.findOneAndDelete({owner : req.user._id, _id : req.params.id})

    if (!deletedTask) {
      return res
        .status(404)
        .send({ error: "There is no this type task in database ..." });
    }
    res.send(deletedTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = taskRouter