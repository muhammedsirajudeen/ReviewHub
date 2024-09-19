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

export default router;
