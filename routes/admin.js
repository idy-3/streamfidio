const router = require("express").Router();
// const {body} = require("express-validator");
const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

router.get("/signup", adminController.getSignup);

router.post("/signup", adminController.postSignup);

router.get("/login", adminController.getLogin);

router.post("/login", adminController.postLogin);

router.post("/logout", isAuth, adminController.postLogout);

router.get("/reset", adminController.getReset);

router.post("/reset", adminController.postReset);

router.get("/reset/:token", adminController.getNewPassword);

router.post("/new-password", adminController.postNewPassword);

// dashboards

router.get("/dashboard", isAuth, adminController.getDashboard);

router.post("/update-name/:mediaId",  isAuth, adminController.postUpdateVideoName);
// router.post("/delete/video", adminController.getDashboard);

router.get("/all-reports", isAuth, adminController.getReports);

router.post("/solved-report/:reportId", isAuth, adminController.postSolvedReport);

// router.post("/solve/report", isAuth, adminController.getDashboard);

module.exports = router;
