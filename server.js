"use strict";

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();

// Connecting to mLab - MongoDB
require("./secrets.js");
mongoose.connect(process.env.MLAB_URI);

// Multer configuration
const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, "./uploads");
    },
    filename: (req, file, next) => {
      const ext = file.mimetype.split("/")[1];
      next(null, `${file.fieldname}-${Date.now()}-${ext}`);
    }
  })
};

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
app.post(
  "/api/fileanalyse",
  multer(multerConfig).single("upfile"),
  (req, res, next) => {
    File.create(parseFileData(req.file), (err, data) => {
      if (err) next(err);
      let { name, type, size } = data;
      const metadata = { name, type, size };
      res.status(200).json(metadata);
    });
  }
);

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Node.js listening ...", listener.address().port);
});
