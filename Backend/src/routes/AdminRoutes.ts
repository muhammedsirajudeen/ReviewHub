import express from "express";
import AdminController from "../controller/admin/AdminController";
import CourseController from "../controller/admin/CourseController";
import passport from "passport";
import upload from "../helper/fileuploadHelper";
import UploadHandler from "../helper/fileuploadHelper";
const router = express.Router();

//user Management
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  AdminController.AllUsers
);
router.delete(
  "/user/:email",
  passport.authenticate("jwt", { session: false }),
  AdminController.DeleteUser
);

router.put(
  "/user",
  passport.authenticate("jwt", { session: false }),
  UploadHandler('profile').single('file'),
  AdminController.UpdateUser
);

//Course Management
router.post(
  "/course",
  passport.authenticate("jwt",{session:false}),
  UploadHandler('course').single('file'),
  CourseController.CourseController
)

export default router;
