import { Request, Response } from 'express';
import Course from '../../model/Course';
import { IUser } from '../../model/User';
import mongoose from 'mongoose';

export const PAGE_LIMIT = 10;

interface dateProps {
  $gt: Date;
}
interface favoriteProps{
  $in:mongoose.Types.ObjectId[]
}
interface queryProps {
  domain?: string;
  postedDate?: dateProps;
  courseName?: RegExp;
  unlistStatus?: boolean;
  _id?:favoriteProps
}

//constructing the query as it goes
const CourseList = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    let { page } = req.query ?? '1';
    const { domain } = req.query;
    const { date, search, favorite } = req.query;
    console.log(user.favoriteCourses)
    const newDate: Date = new Date(date as string);
    const query: queryProps = {};
    if (user.authorization !== 'admin') {
      query.unlistStatus = false;
    }
    if (domain) query.domain = domain as string;
    if (date) query.postedDate = { $gt: newDate };
    if (search) query.courseName = new RegExp(search as string, 'i');
    if(favorite){
      query._id={$in:user.favoriteCourses}
    }
    const length = (await Course.find(query)).length;
    const Courses = await Course.find(query)
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
