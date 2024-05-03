const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")
const { userModel } = require("./models/user.model")
const { exerciseModel } = require("./models/exercise.model")
const { logModel } = require("./models/log.model")

app.use(cors())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

// post request on users endpoint
app.post("/api/users", async (req, res) => {
  const existingUser = await userModel
    .findOne({ username: req.body.username })
    .select(["-__v"])

  if (existingUser) {
    return res.json(existingUser)
  }

  const newUser = await userModel.create({
    username: req.body.username,
  })

  const recentlyRegisteredUser = await userModel
    .findOne({
      _id: newUser._id,
    })
    .select(["username", "_id"])

  return res.json(recentlyRegisteredUser)
})

app.post("/api/users/:userId/exercises", async (req, res) => {
  const foundUser = await userModel.findOne({
    _id: req.params.userId,
  })

  if (!foundUser) {
    return res.json({
      error: `user not found with id: ${req.params.userId}`,
    })
  }

  const foundExercise = await exerciseModel
    .findOne({
      _id: req.params.userId,
    })
    .select(["-__v"])

  if (!foundExercise) {
    const newlyCreatedExercise = await exerciseModel.create({
      _id: req.params.userId,
      username: foundUser.username,
      date: new Date(req.body.date).toDateString(),
      duration: req.body.duration,
      description: req.body.description,
    })

    const recentlyCreatedExercise = await exerciseModel
      .findOne({
        _id: newlyCreatedExercise._id,
      })
      .select(["-__v"])

    const newlyCreatedLog = await logModel.create({
      _id: req.params.userId,
      username: foundUser.username,
      log: [
        {
          date: new Date(req.body.date).toDateString(),
          duration: req.body.duration,
          description: req.body.description,
        },
      ],
    })

    return res.json(recentlyCreatedExercise)
  }

  const updatedDataForExercise = await exerciseModel.updateOne(
    { _id: req.params.userId },
    {
      _id: req.params.userId,
      username: foundUser.username,
      date: new Date(req.body.date).toDateString(),
      duration: req.body.duration,
      description: req.body.description,
    },
    { new: true }
  )

  const updatedDataForLogs = await logModel.updateOne(
    { _id: req.params.userId },
    {
      $push: {
        log: {
          date: new Date(req.body.date).toDateString(),
          duration: req.body.duration,
          description: req.body.description,
        },
      },
    },
    {
      new: true,
      //to return updated document or else it returns old document
    }
  )

  return res.json(updatedDataForExercise)
})

app.get("/api/users/:userId/logs", async (req, res) => {
  const userId = req.params.userId

  const logs = await logModel.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $addFields: {
        count: {
          $size: "$log",
        },
      },
    },
  ])

  console.log(logs)

  return res.json(logs)
})

mongoose.connect(process.env.mongodb_url).then(() => {
  console.log("mongoose connected")

  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port)
  })
})
