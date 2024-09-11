import express, { Request, Response } from "express";
import GoogleAuthController from "../controller/auth/GoogleAuthController";
import CredentialAuthController from "../controller/auth/CredentialAuthController";
import passport from "passport";
import TokenVerifier from "../controller/auth/TokenVerifier";
import upload from "../helper/fileuploadHelper";
const router = express.Router();

import "./passport-setup/passport-setup";
import UploadHandler from "../helper/fileuploadHelper";

router.post("/google/login", GoogleAuthController.GoogleLogin);
router.post("/google/signup", GoogleAuthController.GoogleSignup);

router.post("/forgot",CredentialAuthController.CredentialForgot)

router.post("/password",CredentialAuthController.CredentialPasswordChange)

router.post(
  "/credential/signup",
  UploadHandler('profile').single('file'),
  CredentialAuthController.CredentialSignup
);
router.post("/credential/signin", CredentialAuthController.CredentialSignin);




router.get(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  TokenVerifier.TokenVerifier
);



export default router;
