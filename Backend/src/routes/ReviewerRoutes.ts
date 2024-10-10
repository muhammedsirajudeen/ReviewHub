import express from 'express';
import passport from 'passport';
const router = express.Router();

import './passport-setup/passport-setup';
import UploadHandler from '../helper/fileuploadHelper';
import ReviewerController from '../controller/reviewer/ReviewerController';
import ReviewController from '../controller/reviewer/ReviewController';
import DashboardController from '../controller/reviewer/DashboardController';

router.get(
  '/approval',
  passport.authenticate('jwt', { session: false }),
  ReviewerController.ApprovalStatus
);

router.post(
  '/approval',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('pdf').single('file'),
  ReviewerController.ReviewerApproval
);

//review management
router.get(
  '/reviews',
  passport.authenticate('jwt', { session: false }),
  ReviewController.GetReviews
);

router.get(
  '/review/committed',
  passport.authenticate('jwt', { session: false }),
  ReviewController.CommittedReview
);
router.put(
  '/review/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.CommitReview
);

router.delete(
  '/review/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.CancelReview
);
router.put(
  '/reviewcompletion',
  passport.authenticate('jwt',{session:false}),
  ReviewController.ReviewStatus
)

//dashboard management

router.get(
  '/dashboard',
  passport.authenticate('jwt',{session:false}),
  DashboardController.GetReviewerDashboard
)

export default router;
