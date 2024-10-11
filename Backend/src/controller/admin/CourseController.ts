import { Request, Response } from 'express';
import Course from '../../model/Course';
import { IUser } from '../../model/User';
import {
  minLengthValidator,
  spaceValidator,
  specialCharValidator,
} from '../../helper/validationHelper';

//add course here
const AddCourse = async (req: Request, res: Response) => {
  let { courseName, courseDescription, domain, tagline, unlistStatus } =
    req.body;

  if (
    spaceValidator(courseName) ||
    spaceValidator(courseDescription) ||
    spaceValidator(domain) ||
    spaceValidator(tagline)
  ) {
    return res.status(400).json({ message: 'bad request' });
  }
  if (
    specialCharValidator(courseName) ||
    specialCharValidator(courseDescription) ||
    specialCharValidator(domain) ||
    specialCharValidator(tagline)
  ) {
    return res.status(400).json({ message: 'bad request' });
  }
  if (
    minLengthValidator(courseName) ||
    minLengthValidator(courseDescription) ||
    minLengthValidator(domain) ||
    specialCharValidator(tagline)
  ) {
    return res.status(400).json({ message: 'bad request' });
  }
  unlistStatus = JSON.parse(unlistStatus);
  let userhere = req.user as IUser;
  if (userhere.authorization !== 'admin') {
    return res.status(403).json({ message: 'insufficient permissions' });
  }
  try {
    let checkCourse = await Course.findOne({ courseName: courseName });
    if (checkCourse) {
      res.status(409).json({ message: 'course already exists' });
    } else {
      const newCourse = new Course({
        courseName,
        courseDescription,
        domain,
        tagline,
        courseImage: req.file?.filename,
        unlistStatus: unlistStatus,
      });
      await newCourse.save();

      res.status(200).json({ message: 'success', course: newCourse });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//update the course here
const UpdateCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (user.authorization !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      let {
        courseId,
        courseName,
        courseDescription,
        domain,
        tagline,
        unlistStatus,
      } = req.body;
      if (
        spaceValidator(courseName) ||
        spaceValidator(courseDescription) ||
        spaceValidator(domain) ||
        spaceValidator(tagline)
      ) {
        return res.status(400).json({ message: 'bad request' });
      }
      if (
        specialCharValidator(courseName) ||
        specialCharValidator(courseDescription) ||
        specialCharValidator(domain) ||
        specialCharValidator(tagline)
      ) {
        return res.status(400).json({ message: 'bad request' });
      }
      if (
        minLengthValidator(courseName) ||
        minLengthValidator(courseDescription) ||
        specialCharValidator(tagline)
      ) {
        return res.status(400).json({ message: 'bad request' });
      }
      unlistStatus = JSON.parse(unlistStatus);
      const checkCourse = await Course.findById(courseId);
      if (checkCourse) {
        //partially updating the contents
        checkCourse.courseName = courseName ?? checkCourse.courseName;
        checkCourse.courseDescription =
          courseDescription ?? checkCourse.courseDescription;
        checkCourse.domain = domain ?? checkCourse.domain;
        checkCourse.tagline = tagline ?? checkCourse.tagline;
        checkCourse.courseImage = req.file?.filename ?? checkCourse.courseImage;
        checkCourse.unlistStatus = unlistStatus ?? checkCourse.unlistStatus;
        await checkCourse.save();
        const newCourse = await Course.findById(checkCourse.id);
        res.status(200).json({ message: 'success', course: newCourse });
      } else {
        res.status(404).json({ message: 'No course found' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

//delete the course
const DeleteCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (user.authorization !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      const { courseId } = req.params;
      //disabling hard delete(
      // const deleteCourse=await Course.findByIdAndDelete(courseId)
      const unlistCourse = await Course.findById(courseId);
      if (unlistCourse) {
        unlistCourse.unlistStatus = true;
        await unlistCourse.save();
        res.status(200).json({ message: 'success' });
      } else {
        res.status(404).json({ message: 'course not found' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  AddCourse,
  UpdateCourse,
  DeleteCourse,
};
