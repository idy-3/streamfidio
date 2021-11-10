const path = require("path");
const crypto = require("crypto");

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

require("dotenv").config();

const videoRoutes = require("./routes/video");
const adminRoutes = require("./routes/admin");

const mongoConnect = require("./utils/database").mongoConnect;

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.DB_CONNECTION_STRING,
  collection: "sessions",
});
const csrfProtection = csrf();

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

// configure session for authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(csrfProtection);
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  // res.locals.userId = req.session.user._id
  // console.log(res.locals.csrfToken);
  next();
});

app.use(adminRoutes);
app.use(videoRoutes);

app.use((req, res, next) => {
  res.status(404).render("404.ejs", {
    pageTitle: "Page Not Found",
    errorMsg: "",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(
    process.env.DB_CONNECTION_STRING,

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
