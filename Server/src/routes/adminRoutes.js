import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getStats, getUsers, updateRole } from "../controllers/adminController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.route("/new").post(
  isAuth, 
  isAdmin, 
  upload.fields([{
    name: "image",
    maxCount: 1
  }]),
  createCourse
)

router.route("/:id").post(
  isAuth, 
  isAdmin, 
  upload.fields([{
    name: "lecture",
    maxCount: 1
  }]),
  addLectures
)

router.route("/:id").delete(isAuth,isAdmin,deleteCourse)
router.route("/lectures/:id").delete(isAuth,isAdmin,deleteLecture)
router.route("/stats").get(isAuth,isAdmin,getStats)
router.route("/updateRole/:id").get(isAuth,isAdmin,getStats)
router.route("/user/updateRole").put(isAuth,isAdmin,updateRole);
router.route("/users").get(isAuth,isAdmin,getUsers)




export default router;