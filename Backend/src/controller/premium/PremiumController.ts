import { configDotenv } from 'dotenv';
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import Payment from '../../model/Payment';
import { IUser } from '../../model/User';
import { razorpayProps } from '../user/payment/PaymentController';
import mongoose from 'mongoose';
import verifyPayment from '../../helper/signatureVerifier';
import Wallet from '../../model/Wallet';
configDotenv();

const OrderPremium = (req: Request, res: Response) => {
  const PREMIUM_AMOUNT = 4868;
  try {
    const user = req.user as IUser;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    var options = {
      amount: (PREMIUM_AMOUNT * 100).toString(), // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };
    instance.orders.create(options, async function (err, order) {
      let newPayment = new Payment({
        amount: PREMIUM_AMOUNT,
        userId: user.id,
        orderId: order.id,
        type: 'premium',
      });
      await newPayment.save();
      res.status(201).json({ message: 'success', orderId: order.id });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const PremiumVerifer = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const razorpay = req.body as razorpayProps;

    const updatePayment = await Payment.findOne({
      orderId: razorpay.razorpay_order_id,
    });
    const userWallet = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(user.id as string),
    });
    if (updatePayment && userWallet) {
      const verifiedStatus = verifyPayment(
        updatePayment?.orderId as string,
        razorpay.razorpay_payment_id,
        razorpay.razorpay_signature,
        process.env.RAZORPAY_KEY_SECRET as string
      );
      console.log(verifiedStatus);
      if (verifiedStatus) {
        updatePayment.status = true;
        userWallet.history.push({
          amount: updatePayment.amount,
          type: 'premium',
          paymentDate: new Date(),
          status: true,
        });
        await userWallet.save();
        await updatePayment.save();
        //update premium status here
        user.premiumMember = true;
        await user.save();
        res.status(201).json({ message: 'success' });
      } else {
        res.status(403).json({ message: 'resource malformed' });
      }
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  OrderPremium,
  PremiumVerifer,
};
