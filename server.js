"use strict";

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const app = express();

// Connecting to mLab - MongoDB
require("./secrets.js");
mongoose.connect(process.env.MLAB_URI);

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// MongoDB models and schemas

const Schema = mongoose.Schema;
const fileSchema = new Schema({
  name: String, // name: "Andrew Wong Resume CV.pdf",
  type: String, // type: "application/pdf",
  size: Number // size: 242873
});

const File = mongoose.model("file", fileSchema);

// Helper Function

const parseFileData = data => {
  return {
    name: data.originalname,
    type: data.mimetype,
    size: data.size
  };
};

// API endpoints

// POST /api/fileanalyse
app.post("/api/fileanalyse", upload.single("upfile"), (req, res, next) => {
  File.create(parseFileData(req.file), (err, data) => {
    if (err) next(err);
    let { name, type, size } = data;
    const metadata = { name, type, size };
    res.status(200).json(metadata);
  });
});

app.listen(PORT, function() {
  console.log("Node.js listening ...");
});
