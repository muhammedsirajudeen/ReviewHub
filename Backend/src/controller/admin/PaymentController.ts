import { Request, Response } from 'express';
import Payment from '../../model/Payment';
import { PAGE_LIMIT } from '../user/CourseController';

interface dateProps {
  $gt: Date;
}

interface queryProps {
  paymentDate?: dateProps;
  status?: boolean;
}

const GetPayments = async (req: Request, res: Response) => {
  try {
    const { page, date, status } = req.query ?? '1';
    const query: queryProps = {};
    if (date !== 'undefined') {
      query.paymentDate = { $gt: new Date(date as string) };
    }
    if (status !== 'undefined') {
      query.status = status === 'success' ? true : false;
    }
    // console.log(query)
    const length = (await Payment.find()).length;
    const Payments = await Payment.find(query)
      .populate('userId')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    res
      .status(200)
      .json({ message: 'success', payments: Payments, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetPayments,
};
