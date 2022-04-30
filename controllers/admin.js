const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const _ = require("underscore");

const User = require("../models/admin");
const Video = require("../models/video");
const Report = require("../models/report");

exports.getSignup = (req, res, next) => {
  res.render("admin/signup", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: req.flash("error")[0],
    alertType: "warning-alert",
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword){
    req.flash("error", "Wrong passwords");
    return res.redirect("/signup");
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exist.");
        return res.redirect("/signup");
      }

      // Encrypt password
      return bcrypt
        .hash(password, 12)
        .then((hashedPass) => {
          // Create New User
          const user = new User({
            email: email,
            password: hashedPass,
            videos: [],
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  res.render("admin/login", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: req.flash("error")[0],
    alertType: "warning-alert",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((match) => {
        if (match) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.isSuper = user.isSuper;
          return req.session.save((err) => {
            err && console.log(err);

            res.redirect("/");
          });
        }
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });
};

exports.getReset = (req, res, next) => {
  res.render("admin/reset", {
    pageTitle: "Stream Fidio - Reset Password",
    errorMsg: req.flash("error")[0],
    alertType: "danger-alert",
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Account with given email does not exist!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        // console.log("send email to user here!");
        res.redirect(`/reset/${token}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render("admin/new-password", {
        pageTitle: "Stream Fidio - Easy Video Sharing",
        errorMsg: req.flash("error")[0],
        alertType: "warning-alert",
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashPass) => {
      resetUser.password = hashPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

const ITEMS_PER_PAGE = 6;

exports.getDashboard = (req, res, next) => {
  // if(!req.session.isLoggedIn){
  //   return res.redirect("/login");
  // }
  let totalVideos;
  const page = +req.query.page || 1;
  let isSuper = req.session.user.isSuper;
  if(!isSuper){
    Video.find().countDocuments().then(numVideos => {
      totalVideos = numVideos;
      return Video.find({ userId: req.session.user._id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    })
    .then(videos => {
        res.render("admin/dashboard", {
          videos: videos,
          pageTitle: "Stream Fidio - Dashboard",
          errorMsg: req.flash("error")[0],
          alertType: "warning-alert",
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalVideos,
          hasPrevPage: page > 1,
          nextPage: page + 1,
          prevPage: page - 1,
          lastPage: Math.ceil(totalVideos / ITEMS_PER_PAGE)
        });
      }
    ).catch((err) => {
      console.log(err);
    });
  } else {
    Video.find().countDocuments().then(numVideos => {
      totalVideos = numVideos;
      return Video.find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    })
    .then(
        videos => {
          res.render("admin/dashboard", {
            videos: videos,
            pageTitle: "Stream Fidio - Dashboard",
            errorMsg: req.flash("error")[0],
            alertType: "warning-alert",
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalVideos,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalVideos / ITEMS_PER_PAGE)
          });
        }
      ).catch((err) => {
        console.log(err);
      });
  }
    
};

exports.postUpdateVideoName = (req, res, next) => {
  const mediaId = req.params.mediaId;
  const mediaName = _.escape(req.body.mediaName);

  const update = { name: mediaName };
  Video.findOneAndUpdate({_id: mediaId}, update)
  .then(
    res.redirect("/dashboard")
  ).catch((err) => {
    console.log(err);
  });
  
}

exports.getReports = (req, res, next) => {
  Report.find({}).then(
    reports => {
      res.render("admin/reports", {
        reports: reports,
        pageTitle: "Stream Fidio - Dashboard",
        errorMsg: req.flash("error")[0],
        alertType: "warning-alert",
      });
    }
  ).catch((err) => {
    console.log(err);
  });
}

exports.postSolvedReport = (req, res, next) => {
  const reportId = req.params.reportId;
  const solved = req.body.solved;

  const update = { solved: solved ? true : false };
  Report.findOneAndUpdate({_id: reportId}, update)
  .then(
    res.redirect("/reports")
  ).catch((err) => {
    console.log(err);
  });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    err && console.log(err);
    res.redirect("/");
  });
};
