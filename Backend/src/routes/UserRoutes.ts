import express from 'express';
import UserController from '../controller/user/UserController';
const router = express.Router();
import passport = require('passport');
import './passport-setup/passport-setup';
import UploadHandler from '../helper/fileuploadHelper';
import CourseController from '../controller/user/CourseController';
import RoadmapController from '../controller/user/RoadmapController';
import ResourceController from '../controller/user/ResourceController';
import EnrollmentController from '../controller/user/EnrollmentController';
import QuizCheckerController from '../controller/user/quiz/QuizCheckerController';
import PaymentController from '../controller/user/payment/PaymentController';
import BlogController from '../controller/user/BlogController';
import PremiumController from '../controller/premium/PremiumController';
import FavoriteController from '../controller/user/FavoriteController';
import ChatController from '../controller/user/chat/ChatController';
import ProgressController from '../controller/user/progress/ProgressController';
import WithdrawalController from '../controller/user/withdrawal/WithdrawalController';
import DomainController from '../controller/user/DomainController';
import ReviewController from '../controller/user/review/ReviewController';
import NotificationController from '../controller/user/notification/NotificationController';
import multer = require('multer');
import ReviewHistoryController from '../controller/user/review/ReviewHistoryController';
import DashboardController from '../controller/user/dashboard/DashboardController';
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
  passport.authenticate('jwt', { session: false }),
  QuizCheckerController.QuizChecker
);

//payment handlers
router.post(
  '/payment/order',
  passport.authenticate('jwt', { session: false }),
  PaymentController.OrderCreator
);

router.post(
  '/payment/order/verify',
  passport.authenticate('jwt', { session: false }),
  PaymentController.OrderVerifier
);

router.put(
  '/payment/order/failure/:orderId',
  passport.authenticate('jwt', { session: false }),
  PaymentController.OrderFailure
);

//blog manager

router.get(
  '/blog/manage',
  passport.authenticate('jwt', { session: false }),
  BlogController.UserBlog
);

router.get(
  '/blog',
  passport.authenticate('jwt', { session: false }),
  BlogController.AllBlog
);

router.post(
  '/blog',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('blog').single('file'),
  BlogController.AddBlog
);

router.put(
  '/blog/:blogId',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('blog').single('file'),
  BlogController.UpdateBlog
);

router.delete(
  '/blog/:blogId',
  passport.authenticate('jwt', { session: false }),
  BlogController.DeleteBlog
);

//premium member management
router.post(
  '/premium',
  passport.authenticate('jwt', { session: false }),
  PremiumController.OrderPremium
);

router.post(
  '/premium/verify',
  passport.authenticate('jwt', { session: false }),
  PremiumController.PremiumVerifer
);

//favorite management
router.post(
  '/favorite/:courseId',
  passport.authenticate('jwt', { session: false }),
  FavoriteController.AddFavorite
);

//chat management for almost everyone
router.get(
  '/chat/users',
  passport.authenticate('jwt', { session: false }),
  ChatController.GetUsers
);

router.get(
  '/chat/connected',
  passport.authenticate('jwt', { session: false }),
  ChatController.GetConnectedUsers
);

router.get(
  '/chat/unread',
  passport.authenticate('jwt', { session: false }),
  ChatController.GetUnread
);

router.post(
  '/chat/clear',
  passport.authenticate('jwt', { session: false }),
  ChatController.ClearUnread
);

router.post(
  '/chat/history',
  passport.authenticate('jwt', { session: false }),
  ChatController.GetHistory
);
router.patch(
  '/chat',
  passport.authenticate('jwt', { session: false }),
  ChatController.DeleteChat
);

//progress manager
router.get(
  '/progress/:courseId',
  passport.authenticate('jwt', { session: false }),
  ProgressController.GetProgress
);

//withdrawal controller

router.post(
  '/withdrawal',
  passport.authenticate('jwt', { session: false }),
  WithdrawalController.WithdrawalController
);

//domain management
router.get(
  '/domain',
  passport.authenticate('jwt', { session: false }),
  DomainController.DomainController
);

//review management
router.get(
  '/review',
  passport.authenticate('jwt', { session: false }),
  ReviewController.GetReview
);

router.get(
  '/review/call/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.CallerFetcher
);

router.post(
  '/review/request/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.RequestReview
);

router.put(
  '/review/schedule/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.ScheduleReview
);

router.get(
  '/review/roadmaps',
  passport.authenticate('jwt', { session: false }),
  ReviewController.GetScheduledRoadmaps
);
const upload = multer(); // Store files in memory (no temp files)

router.post(
  '/review/record',
  passport.authenticate('jwt', { session: false }),
  upload.single('video'),
  ReviewController.ReviewRecord
);

router.delete(
  '/review/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewController.CancelReview
);

//notification management
router.get(
  '/notification',
  passport.authenticate('jwt', { session: false }),
  NotificationController.GetNotification
);
router.delete(
  '/notification/:notificationId',
  passport.authenticate('jwt', { session: false }),
  NotificationController.DeleteNotification
);

//review history management
router.get(
  '/review/history',
  passport.authenticate('jwt', { session: false }),
  ReviewHistoryController.GetHistory
);

router.put(
  '/review/history/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewHistoryController.AddFeedback
);

//dashboard management
router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  DashboardController.GetAnalytics
);

export default router;
