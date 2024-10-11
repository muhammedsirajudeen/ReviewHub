import { Request, Response } from 'express';
import Blog, { IBlog } from '../../model/Blog';
import { IUser } from '../../model/User';
import { PAGE_LIMIT } from './CourseController';

interface dateProps {
  $gt: Date;
}
interface queryProps {
  postedDate?: dateProps;
  heading?: RegExp;
}

const UserBlog = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    let { page } = req.query ?? '1';
    const length = (await Blog.find()).length;
    const userBlogs = await Blog.find({ userId: user.id })
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    res
      .status(200)
      .json({ message: 'success', blogs: userBlogs, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const AllBlog = async (req: Request, res: Response) => {
  try {
    let { page, date, search } = req.query ?? '1';
    const length = (await Blog.find()).length;
    const query: queryProps = {};
    if (date) {
      const newDate = new Date(date as string);
      query.postedDate = { $gt: newDate };
    }
    if (search) {
      query.heading = new RegExp(search as string, 'i');
    }

    const Blogs = await Blog.find(query)
      .populate('userId', 'email -_id')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    res
      .status(200)
      .json({ message: 'success', blogs: Blogs, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const AddBlog = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const blogBody = req.body as IBlog;
    const newBlog = new Blog({
      userId: user.id,
      heading: blogBody.heading,
      article: blogBody.article,
      articleImage: req.file?.filename,
    });
    await newBlog.save();
    const sendBlog = await Blog.findById(newBlog.id).populate('userId', [
      'email',
      'profileImage',
      '-_id',
    ]);
    res.status(201).json({ message: 'success', blog: sendBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const UpdateBlog = async (req: Request, res: Response) => {
  try {
    console.log("hti")
    const user = req.user as IUser;
    const { blogId } = req.params;
    const blogBody = req.body as IBlog;
    const updateBlog = await Blog.findById(blogId as string);
    if (updateBlog) {
      if (updateBlog.userId.toHexString() !== user.id) {
        res.status(403).json({ message: 'user does not have permission' });
        return;
      }
      updateBlog.heading = blogBody.heading ?? updateBlog.heading;
      updateBlog.article = blogBody.article ?? updateBlog.article;
      updateBlog.articleImage = req.file?.filename ?? updateBlog.articleImage;
      await updateBlog.save();
      const newBlog = await Blog.findById(updateBlog.id).populate('userId', [
        'email',
        'profileImage',
        '-_id',
      ]);
      res.status(200).json({ message: 'success', blog: newBlog });
    } else {
      res.status(404).json({ message: 'requested blog not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteBlog = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { blogId } = req.params;
    const deleteBlog = await Blog.findById(blogId);
    if (deleteBlog) {
      if (deleteBlog.userId.toHexString() === user.id) {
        await deleteBlog.deleteOne();
        res.status(200).json({ message: 'success' });
      } else {
        res
          .status(403)
          .json({ message: 'user does not have permission to perform this' });
      }
    } else {
      res.status(404).json({ message: 'requested blog not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};
export default {
  AllBlog,
  AddBlog,
  UpdateBlog,
  DeleteBlog,
  UserBlog,
};
