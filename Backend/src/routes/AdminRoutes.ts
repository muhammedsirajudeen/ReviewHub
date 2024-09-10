import express from "express";
import AdminController from "../controller/AdminController";
import passport from "passport";
import upload from "../helper/fileuploadHelper";
const router = express.Router();

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
  upload.single('file'),
  AdminController.UpdateUser
);

export default router;
