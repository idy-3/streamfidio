const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const crypto = require("crypto");

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3Client = new aws.S3({
  endpoint: spacesEndpoint, 
  accessKeyId: process.env.DO_SPACES_KEY, 
  secretAccessKey: process.env.DO_SPACES_SECRET
});

const fileStorage = new multerS3({
    s3: s3Client,
    bucket: process.env.DO_SPACES_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      // console.log(file)
      cb(null, crypto.randomBytes(20).toString("hex") + "-" + file.originalname);
    },
});
  
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")


module.exports = { upload, s3Client};