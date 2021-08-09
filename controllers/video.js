const Video = require("../models/video");

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
      // console.log(result);
      // res.redirect(`/${result._id}`);
      // console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getVideoDetail = (req, res, next) => {
  const videoId = req.params.videoId;
  Video.findById(videoId).then((video) => {
    res.render("video/video-detail", {
      pageTitle: "Stream Fidio - Easy Video Sharing",
      errorMsg: "",
      video: video,
    });
  });
};
