const Video = require("../models/video");
const moment = require("moment");

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
      // console.log(result);
    })
    .catch((err) => {
      // console.log(err);
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
