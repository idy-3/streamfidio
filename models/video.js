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
    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
