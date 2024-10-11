import { Request, Response } from 'express';
import Review from '../../model/Review';
import Course from '../../model/Course';
import Payment from '../../model/Payment';
import User from '../../model/User';

const AdminDashboardDetails = async (req: Request, res: Response) => {
  try {
    // pending reviews
    const reviewAggregation = (await Review.find({ reviewStatus: false }))
      .length;
    // completed reviews
    const completedReviewAggregation = (
      await Review.find({ reviewStatus: true })
    ).length;
    // total course in platform
    const courseAggregation = (await Course.find()).length;
    // cumulative payment amount
    const paymentTotalAggregation = await Payment.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
        },
      },
    ]);
    console.log(paymentTotalAggregation);
    let totalamount = 0;
    if (paymentTotalAggregation[0]) {
      totalamount = paymentTotalAggregation[0].amount;
    }
    // cumulative success amount
    const paymentsuccessAggregation = (await Payment.find({ status: true }))
      .length;
    // cumulative failure amount
    const paymentfailureAggregation = (await Payment.find({ status: false }))
      .length;
    // user count
    const userCount = (await User.find()).length;
    res.status(200).json({
      message: 'success',
      reviews: reviewAggregation,
      completedreviews: completedReviewAggregation,
      courses: courseAggregation,
      paymentsuccess: paymentsuccessAggregation,
      paymentfailure: paymentfailureAggregation,
      users: userCount,
      totalamount: totalamount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  AdminDashboardDetails,
};
