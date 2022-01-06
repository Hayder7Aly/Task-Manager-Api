const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  
  completed: {
    default: false,
    type: Boolean,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'Users'
  }
},{
  timestamps: true
})

const Tasks = mongoose.model("Tasks", taskSchema );

module.exports = Tasks;
