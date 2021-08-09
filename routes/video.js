const router = require("express").Router();

const videoController = require("../controllers/video");

router.get("/", videoController.getIndex);

router.post("/upload", videoController.postAddVideo);

router.get("/:videoId", videoController.getVideoDetail);

module.exports = router;
