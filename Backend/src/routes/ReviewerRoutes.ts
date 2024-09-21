import express, { Request, Response } from 'express';
import GoogleAuthController from '../controller/auth/GoogleAuthController';
import CredentialAuthController from '../controller/auth/CredentialAuthController';
import passport from 'passport';
import TokenVerifier from '../controller/auth/TokenVerifier';
import upload from '../helper/fileuploadHelper';
const router = express.Router();

import './passport-setup/passport-setup';
import UploadHandler from '../helper/fileuploadHelper';
import ReviewerController from '../controller/reviewer/ReviewerController';


router.post(
    '/approval',
    passport.authenticate('jwt',{session:false}),
    UploadHandler('pdf').single('file'),
    ReviewerController.ReviwerApproval
)


export default router;
