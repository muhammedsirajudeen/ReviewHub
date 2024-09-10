import express from "express";
import UserController from "../controller/UserController";
const router = express.Router();
import passport = require("passport");
import "./passport-setup/passport-setup";
import upload from "../helper/fileuploadHelper";

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  UserController.UserUpdate
);

export default router;
