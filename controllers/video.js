const { validationResult } = require("express-validator");
// const { unlink } = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const _ = require("underscore");

const requestIp = require('request-ip');

const { s3Client } = require("../utils/s3Client");
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
  // console.log(file);
  if (!file) {
   
    return res.status(415).json({
      pageTitle: "Stream Fidio - Easy Video Sharing",
      errorMsg: "Attached file is neither an image or a video.",
      alertType: "warning-alert",
    });
  }
  // https://streamfidio.ams3.cdn.digitaloceanspaces.com
  const videoUrl = "https://streamfidio.ams3.cdn.digitaloceanspaces.com/" + file.key;
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
      res.status(200).json({ path: result._id.toString() });
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
  let userId = req.session.user ? req.session.user._id : undefined;
  const videoId = req.params.videoId;
  let createdBy = false;

  // let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // console.log(ip);
  console.log("req.connection.remoteAddress: "+ req.connection.remoteAddress)
  console.log("req.headers['x-real-ip']: "+ req.headers['x-real-ip'])
  console.log("req.connection.localAddress: "+ req.connection.localAddress)
  console.log("req.headers['x-forwarded-for']: "+ req.headers['x-forwarded-for'])
  console.log("req.socket.remoteAddress: "+ req.socket.remoteAddress)

  let clientIp = requestIp.getClientIp(req);
  console.log(clientIp);

  // skip if videoId is not valid
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next();
  }

  let trendingLinks = [];
  Video.aggregate( [{$match: {trending: true}}, { $sample: { size: 2 } }], function (err, docs) {
    if (err){
      console.log(err);
    }else{  
      for(const doc of docs){
        // console.log(doc);
        trendingLinks.push({
          _id: doc._id,
          name: doc.name
        })
      }
      
    }
  })

  // increment views by 1 and return the updated object
  Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true }).then(
    (video) => {
      if (!video) {
        return res.redirect("/");
      }

      console.log("userId: " + userId)
      
      if (video.userId && userId){
        createdBy = video.userId.toString() === userId.toString();
      }
      
      res.render("video/video-detail", {
        pageTitle: "Stream Fidio - Easy Video Sharing",
        errorMsg: "",

        trendingLinks: trendingLinks,
        video: video,
        dateCreated: video.createdAt,
        createdBy: createdBy,
      });
    }
  );
};

exports.postDeleteVideo = async (req, res, next) => {
  const videoId = req.body.videoId;

  Video.findByIdAndDelete(videoId, async (err, docs) => {
    if (err) {
      console.log(err);
    } else {

      console.log("****docs****")
      console.log(docs)

      const params = {
        Bucket: process.env.DO_SPACES_NAME,
        Key: docs.key,
      };

      try{
        const data = await s3Client.deleteObject(params).promise();
        console.log("Success",data);
        res.redirect("/");
      }catch(error){
        console.log("error", error);
      }
      
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
  const name = _.escape(req.body.name);
  const email = req.body.email;
  const subject = _.escape(req.body.subject);
  const complaint = _.escape(req.body.complaint);
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

exports.getDmca = (req, res, next) => {
  res.render("video/dmca", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",
  });
};

exports.getPrivacy = (req, res, next) => {
  res.render("video/privacy", {
    pageTitle: "Stream Fidio - Easy Video Sharing",
    errorMsg: "",
  });
};
