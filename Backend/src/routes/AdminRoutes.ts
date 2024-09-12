import express from 'express';
import AdminController from '../controller/admin/AdminController';
import CourseController from '../controller/admin/CourseController';
import passport from 'passport';
import upload, { resizeMiddleware } from '../helper/fileuploadHelper';
import UploadHandler from '../helper/fileuploadHelper';
import RoadmapController from '../controller/admin/RoadmapController';
import ChapterController from '../controller/admin/ChapterController';
const router = express.Router();
//user Management
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  AdminController.AllUsers
);
router.delete(
  '/user/:email',
  passport.authenticate('jwt', { session: false }),
  AdminController.DeleteUser
);

router.put(
  '/user',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('profile').single('file'),
  AdminController.UpdateUser
);

//Course Management
router.post(
  '/course',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('course').single('file'),
  resizeMiddleware,
  CourseController.CourseController
);

//roadmap management
router.post(
  '/roadmap',
  passport.authenticate('jwt', { session: false }),
  RoadmapController.AddRoadmap
);

//chapter management
router.get(
  '/chapter/:roadmapId',
  passport.authenticate('jwt',{session:false}),
  ChapterController.ListChapter
)

router.post(
  '/chapter/',
  passport.authenticate('jwt', { session: false }),
  ChapterController.AddChapter
);

export default router;
