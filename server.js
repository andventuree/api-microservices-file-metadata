"use strict";

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");

const app = express();

require("./secrets.js");
mongoose.connect(process.env.MLAB_URI);

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/hello", function(req, res) {
  res.json({ greetings: "Hello, API" });
});

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Node.js listening ...", listener.address().port);
});
