import { Request, Response } from 'express';
import Review from '../../model/Review';

const PAGE_LIMIT = 5;

const ReviewController = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const length=((await Review.find({reviewStatus:true})).length)
    const Reviews = await Review.find({reviewStatus:true})
      .populate('revieweeId')
      .populate('reviewerId')
      .populate('roadmapId')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    res.status(200).json({ message: 'success', reviews: Reviews,pageLength:length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  ReviewController,
};
