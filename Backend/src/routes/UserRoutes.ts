import express from "express";
import UserController from "../controller/user/UserController";
const router = express.Router();
import passport = require("passport");
import "./passport-setup/passport-setup";
import upload from "../helper/fileuploadHelper";
import UploadHandler from "../helper/fileuploadHelper";
import CourseController from "../controller/user/CourseController";

router.get("/course", passport.authenticate("jwt", { session: false }),CourseController.CourseList);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  UploadHandler("profile").single("file"),
  UserController.UserUpdate
);

export default router;
