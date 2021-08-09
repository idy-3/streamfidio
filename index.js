const path = require("path");
const crypto = require("crypto");

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const videoRoutes = require("./routes/video");

const mongoConnect = require("./utils/database").mongoConnect;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "videos");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(20).toString("hex") + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("video")
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/videos", express.static(path.join(__dirname, "videos")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(videoRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not Found!</h1>");
});

mongoose
  .connect(
    "mongodb+srv://areababa:NrKSMkb3RUFXyO3k@cluster0.icgkh.mongodb.net/fidio?retryWrites=true&w=majority",

    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(3000);
// });
