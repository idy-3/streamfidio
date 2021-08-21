const path = require("path");
const crypto = require("crypto");

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();

const videoRoutes = require("./routes/video");

const mongoConnect = require("./utils/database").mongoConnect;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage");
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
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/storage", express.static(path.join(__dirname, "storage")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(videoRoutes);

app.use((req, res, next) => {
  res.status(404).render("404.ejs", {
    pageTitle: "Page Not Found",
    errorMsg: "",
  });
});

mongoose
  .connect(
    process.env.DB_CONNECTION_STRING,

    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
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
