const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isSuper: {
    type: Boolean,
    default: false
  },
  videos: [
    {
      videoId: { type: Schema.Types.ObjectId, required: false },
    },
  ],
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
