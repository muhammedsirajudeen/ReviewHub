import { Request, Response } from 'express';
import Course from '../../model/Course';

const PAGE_LIMIT = 10;

const CourseList = async (req: Request, res: Response) => {
  try {
    let { page } = req.query ?? '1';
    const length = (await Course.find()).length;
    const Courses = await Course.find()
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    res
      .status(200)
      .json({ message: 'success', courses: Courses ?? [], pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  CourseList,
};
