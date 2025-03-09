import express from "express";
import { checkout, fetchLecture, fetchLectures, getAllCourses, getCourse, getMyCourses, paymentVerification } from "../controllers/courseController.js";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";

const router = express.Router();


router.route("/mycourse").get(isAuth,getMyCourses);
router.route("/all").get(getAllCourses);
router.route("/:id").get(getCourse);
router.route("/lectures/:id").get(isAuth,fetchLecture);
router.route("/:id/lectures").get(isAuth,fetchLectures);


router.post("/:id/checkout", isAuth, checkout);
router.post("/:id/checkout/verification", isAuth, paymentVerification);

export default router;