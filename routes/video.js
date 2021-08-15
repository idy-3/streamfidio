const router = require("express").Router();
const { body } = require("express-validator");

const videoController = require("../controllers/video");

router.get("/", videoController.getIndex);

router.post("/upload", videoController.postAddVideo);

router.get("/report/:videoId", videoController.getReport);

router.post(
  "/report/:videoId",
  [
    body("name", "Name should not be empty and atleast 3 characters")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("subject").not().isEmpty().withMessage("Subject should not be empty"),
    body("complaint")
      .not()
      .isEmpty()
      .withMessage("Complaint should not be empty"),
  ],
  videoController.postReport
);

router.get("/privacy", videoController.getPrivacy);

router.get("/:videoId", videoController.getVideoDetail);

module.exports = router;
