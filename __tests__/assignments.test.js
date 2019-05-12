const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const assignment = ["EECE 555", "test_teacher_id", "Final Project", 100, "Project"];

router.post("/assignment", async (req, res) => {
  let newAssignment = await Assignment.create(req.body)
  newAssignment.teacher_id = req.userId
  await newAssignment.save()
  res.send(newAssignment)
});
