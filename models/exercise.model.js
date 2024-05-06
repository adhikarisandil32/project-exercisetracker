const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
  // to disable __v
)

const exerciseModel = mongoose.model("Exercise", exerciseSchema)

module.exports = { exerciseModel }
