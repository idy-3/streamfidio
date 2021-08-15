const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    videoId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    complaint: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
