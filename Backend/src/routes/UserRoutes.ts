import express from "express";
import UserController from "../controller/user/UserController";
const router = express.Router();
import passport = require("passport");
import "./passport-setup/passport-setup";
import upload from "../helper/fileuploadHelper";
import UploadHandler from "../helper/fileuploadHelper";
import CourseController from "../controller/user/CourseController";
import RoadmapController from "../controller/user/RoadmapController";
import ResourceController from '../controller/user/ResourceController';

router.get("/course", passport.authenticate("jwt", { session: false }),CourseController.CourseList);

router.get("/roadmap/:courseId",passport.authenticate("jwt",{session:false}),RoadmapController.RoadmapList)

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  UploadHandler("profile").single("file"),
  UserController.UserUpdate
);

//resource management
router.get(
  '/resource/:chapterId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.GetResource
)

export default router;
