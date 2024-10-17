import express, { NextFunction, Request, Response } from 'express';
import AdminController from '../controller/admin/AdminController';
import CourseController from '../controller/admin/CourseController';
import passport from 'passport';
import { resizeMiddlewareWrapper } from '../helper/fileuploadHelper';
import UploadHandler from '../helper/fileuploadHelper';
import RoadmapController from '../controller/admin/RoadmapController';
import ChapterController from '../controller/admin/ChapterController';
import ResourceController from '../controller/admin/ResourceController';

import { IUser } from '../model/User';
import PaymentController from '../controller/admin/PaymentController';
import WithdrawalController from '../controller/admin/WithdrawalController';
import DomainController from '../controller/admin/DomainController';
import ReviewController from '../controller/admin/ReviewController';
import AdminDashboardController from '../controller/admin/DashboardController';
const router = express.Router();

const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  if (user.authorization !== 'admin') {
    res.status(403).json({ message: 'insufficient permissions' });
  } else {
    next();
  }
};

//user Management
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  AdminController.AllUsers
);

router.patch(
  '/user/block/:userId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  AdminController.BlockUser
);

//Course Management
router.post(
  '/course',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('course').single('file'),
  resizeMiddlewareWrapper('course'),
  CourseController.AddCourse
);

router.put(
  '/course',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('course').single('file'),
  resizeMiddlewareWrapper('course'),
  CourseController.UpdateCourse
);

router.delete(
  '/course/:courseId',
  passport.authenticate('jwt', { session: false }),
  CourseController.DeleteCourse
);

//roadmap management
router.post(
  '/roadmap',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  UploadHandler('roadmap').single('file'),
  resizeMiddlewareWrapper('roadmap'),
  RoadmapController.AddRoadmap
);

router.put(
  '/roadmap/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  UploadHandler('roadmap').single('file'),
  resizeMiddlewareWrapper('roadmap'),
  RoadmapController.EditRoadmap
);

router.delete(
  '/roadmap/:roadmapId',

  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  RoadmapController.DeleteRoadmap
);

//chapter management
router.get(
  '/chapter/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ChapterController.ListChapter
);

router.post(
  '/chapter/',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ChapterController.AddChapter
);

router.put(
  '/chapter/:chapterId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ChapterController.UpdateChapter
);

router.delete(
  '/chapter/:chapterId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ChapterController.DeleteChapter
);

//resource management
router.get(
  '/resource/:chapterId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.GetResource
);

router.post(
  '/resource/:resourceId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.AddResource
);

router.put(
  '/resource/:resourceId/:sectionId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.EditResource
);

router.delete(
  '/resource/:resourceId/:sectionId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.DeleteResource
);

//quiz management
router.get(
  '/quiz/:chapterId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.GetQuiz
);

router.post(
  '/quiz/:quizId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.AddQuiz
);

router.put(
  '/quiz/:quizId/:questionId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.EditQuiz
);

router.delete(
  '/quiz/:quizId/:questionId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  ResourceController.DeleteQuiz
);

//approval management
router.get(
  '/reviewer/approvals',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  AdminController.AllApprovals
);

router.put(
  '/reviewer/approve/:approvalId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,

  AdminController.ApproveReviewer
);

//payment management
router.get(
  '/payments',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  PaymentController.GetPayments
);

//withdrawal management
router.get(
  '/withdrawals',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  WithdrawalController.Withdrawals
);

router.put(
  '/withdrawal/:withdrawalId',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  WithdrawalController.ApproveWithdrawal
);

//domain management
//this particular route is accessible by
router.get(
  '/domain',
  passport.authenticate('jwt', { session: false }),
  // AdminMiddleware,
  DomainController.GetDomain
);

router.post(
  '/domain',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  DomainController.AddDomain
);
router.put(
  '/domain/:domain',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  DomainController.EditDomain
);

router.delete(
  '/domain/:domain',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  DomainController.DeleteDomain
);

//review history management
router.get(
  '/review',
  passport.authenticate('jwt', { session: false }),
  AdminMiddleware,
  ReviewController.ReviewController
);
router.delete(
  '/review/:videoName',
  passport.authenticate('jwt',{session:false}),
  AdminMiddleware,
  ReviewController.DeleteRecording
)
//dashboard details
router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  AdminDashboardController.AdminDashboardDetails
);

export default router;
