const mongoose = require("mongoose")

const logSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    _id: {
      type: String,
    },
    log: [
      {
        description: {
          type: String,
        },
        duration: {
          type: Number,
        },
        date: {
          type: String,
        },
      },
    ],
    count: {
      type: Number,
    },
  },
  { versionKey: false }
)

const logModel = mongoose.model("Log", logSchema)

module.exports = { logModel }
