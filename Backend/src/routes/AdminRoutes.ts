import express from 'express';
import AdminController from '../controller/admin/AdminController';
import CourseController from '../controller/admin/CourseController';
import passport, { authenticate } from 'passport';
import upload, {
  resizeMiddleware,
  resizeMiddlewareWrapper,
} from '../helper/fileuploadHelper';
import UploadHandler from '../helper/fileuploadHelper';
import RoadmapController from '../controller/admin/RoadmapController';
import ChapterController from '../controller/admin/ChapterController';
import ResourceController from '../controller/admin/ResourceController';
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
  UploadHandler('roadmap').single('file'),
  resizeMiddlewareWrapper('roadmap'),
  RoadmapController.AddRoadmap
);

router.put(
  '/roadmap/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('roadmap').single('file'),
  resizeMiddlewareWrapper('roadmap'),
  RoadmapController.EditRoadmap
);

router.delete(
  '/roadmap/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  RoadmapController.DeleteRoadmap
);

//chapter management
router.get(
  '/chapter/:roadmapId',
  passport.authenticate('jwt', { session: false }),
  ChapterController.ListChapter
);

router.post(
  '/chapter/',
  passport.authenticate('jwt', { session: false }),
  ChapterController.AddChapter
);

router.put(
  '/chapter/:chapterId',
  passport.authenticate('jwt', { session: false }),
  ChapterController.UpdateChapter
);

router.delete(
  '/chapter/:chapterId',
  passport.authenticate('jwt', { session: false }),
  ChapterController.DeleteChapter
);

//resource management
router.get(
  '/resource/:chapterId',
  passport.authenticate('jwt', { session: false }),
  ResourceController.GetResource
);

router.post(
  '/resource/:resourceId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.AddResource
)

router.put(
  '/resource/:resourceId/:sectionId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.EditResource
)

router.delete(
  '/resource/:resourceId/:sectionId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.DeleteResource
)

//quiz management
router.get(
  '/quiz/:chapterId',
  passport.authenticate('jwt', { session: false }),
  ResourceController.GetQuiz
);

router.post(
  '/quiz/:quizId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.AddQuiz
)

router.put(
  '/quiz/:quizId/:questionId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.EditQuiz

)

router.delete(
  '/quiz/:quizId/:questionId',
  passport.authenticate('jwt',{session:false}),
  ResourceController.DeleteQuiz
)

export default router;
