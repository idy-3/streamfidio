const moment = require("moment");
const { validationResult } = require("express-validator");

const Video = require("../models/video");
const Report = require("../models/report");

exports.getIndex = (req, res, next) => {
  res.render("video/index", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",
  });
};

exports.postAddVideo = (req, res, next) => {
  const file = req.file;
  // console.log(file);
  if (!file) {
    return res.status(422).render("video/index", {
      pageTitle: "Stream Fidio - Easy Video Sharing",
      errorMsg: "Attached file is neither an image or a video.",
      alertType: "danger-alert",
    });
  }

  const videoUrl = "\\" + file.path;
  const video = new Video({
    videoUrl: videoUrl,
    type: file.mimetype.split("/")[0],
  });

  video
    .save()
    .then((result) => {
      // console.log("VideoUrl added!");
      res.status(200).json({ path: result._id });
    })
    .catch((err) => {
      res.status(500).json({ err: "500 Error: Upload failed!" });
    });
};

exports.getVideoDetail = (req, res, next) => {
  const videoId = req.params.videoId;

  // increment views by 1 and return the updated object
  Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true }).then(
    (video) => {
      // console.log(video);

      res.render("video/video-detail", {
        pageTitle: "Stream Fidio - Easy Video Sharing",
        errorMsg: "",
        video: video,
        dateCreated: moment(video.createdAt, "YYYYMMDD").fromNow(),
      });
    }
  );
};

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
