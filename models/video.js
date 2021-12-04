const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    name: String,
    key: String,
    fileSize: Number,
    videoUrl: { type: String, required: true },
    type: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    views: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);

// const mongodb = require('mongodb')
// const getDb = require("../utils/database").getDb;

// class Video {
//   constructor(videoUrl) {
//     this.videoUrl = videoUrl;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("videos")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("videos")
//       .find()
//       .toArray()
//       .then((videos) => {
//         console.log(videos);
//         return videos;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(videoId) {
//     const db = getDb();

//     return db
//       .collection("videos")
//       .find({ _id: new mongodb.ObjectId(videoId) })
//       .next()
//       .then((video) => {
//         console.log(video);
//         return video;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Video;
