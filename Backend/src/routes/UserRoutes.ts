import express from 'express';
import UserController from '../controller/user/UserController';
const router = express.Router();
import passport = require('passport');
import './passport-setup/passport-setup';
import upload from '../helper/fileuploadHelper';
import UploadHandler from '../helper/fileuploadHelper';
import CourseController from '../controller/user/CourseController';
import RoadmapController from '../controller/user/RoadmapController';
import ResourceController from '../controller/user/ResourceController';
import EnrollmentController from '../controller/user/EnrollmentController';
import QuizCheckerController from '../controller/user/quiz/QuizCheckerController';
import PaymentController from '../controller/user/payment/PaymentController';
import BlogController from '../controller/user/BlogController';
import PremiumController from '../controller/premium/PremiumController';
router.get(
  '/course',
  passport.authenticate('jwt', { session: false }),
  CourseController.CourseList
);

router.get(
  '/roadmap/:courseId',
  passport.authenticate('jwt', { session: false }),
  RoadmapController.RoadmapList
);

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('profile').single('file'),
  UserController.UserUpdate
);

//resource viewer
router.get(
  '/resource/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  ResourceController.GetResources
);

//enrollment manager
router.get(
  '/enroll',
  passport.authenticate('jwt', { session: false }),
  EnrollmentController.GetEnroll
);

router.get(
  '/enroll/:courseId',
  passport.authenticate('jwt', { session: false }),
  EnrollmentController.GetEnrollById
);

router.post(
  '/enroll',
  passport.authenticate('jwt', { session: false }),
  EnrollmentController.Enroll
);

router.delete(
  '/enroll/:courseId',
  passport.authenticate('jwt', { session: false }),
  EnrollmentController.DeleteEnrollById
);

//quuiz checker
router.post(
  '/quiz/check/:quizId',
  passport.authenticate('jwt',{session:false}),
  QuizCheckerController.QuizChecker
)

//payment handlers
router.post(
  '/payment/order',
  passport.authenticate('jwt',{session:false}),
  PaymentController.OrderCreator
)

router.post(
  '/payment/order/verify',
  passport.authenticate('jwt',{session:false}),
  PaymentController.OrderVerifier
)

router.put(
  '/payment/order/failure/:orderId',
  passport.authenticate('jwt',{session:false}),
  PaymentController.OrderFailure
)

//blog manager

router.get(
  '/blog/manage',
  passport.authenticate('jwt',{session:false}),
  BlogController.UserBlog
)

router.get(
  '/blog',
  passport.authenticate('jwt',{session:false}),
  BlogController.AllBlog
)

router.post(
  '/blog',
  passport.authenticate('jwt',{session:false}),
  UploadHandler('blog').single('file'),
  BlogController.AddBlog
)

router.put(
  '/blog/:blogId',
  passport.authenticate('jwt',{session:false}),
  UploadHandler('blog').single('file'),
  BlogController.UpdateBlog
)

router.delete(
  '/blog/:blogId',
  passport.authenticate('jwt',{session:false}),
  BlogController.DeleteBlog
)

//premium member management
router.post(
  '/premium',
  passport.authenticate('jwt',{session:false}),
  PremiumController.OrderPremium
)


export default router;
