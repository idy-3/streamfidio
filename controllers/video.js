const { validationResult } = require("express-validator");
const { unlink } = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Video = require("../models/video");
const Report = require("../models/report");

exports.getIndex = (req, res, next) => {
  res.render("video/index", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",
  });
};

exports.postAddVideo = (req, res, next) => {
  let userId = req.session.user ? req.session.user._id : undefined;
  const file = req.file;
  console.log(file);
  if (!file) {
    // return res.status(422).render("video/index", {
    //   pageTitle: "Stream Fidio - Easy Video Sharing",
    //   errorMsg: "Attached file is neither an image or a video.",
    //   alertType: "danger-alert",
    // });
    return res.status(415).json({
      pageTitle: "Stream Fidio - Easy Video Sharing",
      errorMsg: "Attached file is neither an image or a video.",
      alertType: "warning-alert",
    });
  }

  const videoUrl = "https://streamfidio.fra1.digitaloceanspaces.com/" + file.key;
  const video = new Video({
    name: file.originalname,
    key: file.key,
    fileSize: file.size,
    videoUrl: videoUrl,
    type: file.mimetype.split("/")[0],
    userId: userId,
  });

  video
    .save()
    .then((result) => {
      // console.log("VideoUrl added!");
      res.status(200).json({ path: result._id });
    })
    .catch((err) => {
      res.status(500).json({
        pageTitle: "Stream Fidio - Easy Video Sharing",
        errorMsg: "500 Error: Upload failed!",
        alertType: "warning-alert",
      });
    });
};

exports.getVideoDetail = (req, res, next) => {
  const videoId = req.params.videoId;

  // skip if videoId is not valid
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next();
  }
  // increment views by 1 and return the updated object
  Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true }).then(
    (video) => {
      if (!video) {
        return res.redirect("/");
      }

      res.render("video/video-detail", {
        pageTitle: "Stream Fidio - Easy Video Sharing",
        errorMsg: "",

        video: video,
        dateCreated: video.createdAt,
      });
    }
  );
};

exports.postDeleteVideo = (req, res, next) => {
  const videoId = req.body.videoId;

  Video.findByIdAndDelete(videoId, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      // Delete Video File from FileSystem
      unlink(path.join(__dirname, "..", docs.videoUrl), (err) => {
        if (err) throw err;
        // console.log("File was deleted");

        res.redirect("/");
      });
    }
  });
};

// Report Video Violating Use Policy

exports.getReport = (req, res, next) => {
  const videoId = req.params.videoId;
  res.render("video/report", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",

    videoId: videoId,
  });
};

exports.postReport = (req, res, next) => {
  const videoId = req.params.videoId;
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const complaint = req.body.complaint;
  const errors = validationResult(req);
  // console.log(videoId);

  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render("video/report", {
      pageTitle: "Stream Fidio - Easy Video Sharing",
      errorMsg: errors.array(),
      videoId: videoId,
      alertType: "danger-alert",
    });
  }

  const report = new Report({
    videoId: videoId,
    name: name,
    email: email,
    subject: subject,
    complaint: complaint,
  });

  report
    .save()
    .then((result) => {
      // console.log("Created Report");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPrivacy = (req, res, next) => {
  res.render("video/privacy", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",
  });
};
