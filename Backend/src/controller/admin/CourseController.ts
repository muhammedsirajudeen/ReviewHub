import { Request, Response } from "express";
import Course from "../../model/Course";
import { IUser } from "../../model/User";
const CourseController = async (req: Request, res: Response) => {
  let { courseName, courseDescription, domain, tagline } = req.body;
  
  let userhere = req.user as IUser;
  if (userhere.authorization !== "admin") {
    return res.status(403).json({ message: "insufficient permissions" });
  }
  try {
    let checkCourse = await Course.findOne({ courseName: courseName });
    if (checkCourse) {
      res.status(409).json({ message: "course already exists" });
    } else {
      const newCourse = new Course({
        courseName,
        courseDescription,
        domain,
        tagline,
        courseImage: req.file?.filename,
      });
      await newCourse.save();
      res.json({ message: "success" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error occured" });
  }
};

export default {
  CourseController,
};
