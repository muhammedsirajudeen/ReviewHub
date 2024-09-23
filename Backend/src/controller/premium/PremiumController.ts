import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import Payment from "../../model/Payment";
import { IUser } from "../../model/User";
configDotenv();

const OrderPremium=(req:Request,res:Response)=>{
    const PREMIUM_AMOUNT=4868
    try{
        const user = req.user as IUser;
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID as string,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        var options = {
          amount: (PREMIUM_AMOUNT*100).toString(), // amount in the smallest currency unit
          currency: 'INR',
          receipt: 'order_rcptid_11',
        };
        instance.orders.create(options, async function (err, order) {
          let newPayment = new Payment({
            amount: PREMIUM_AMOUNT,
            userId: user.id,
            orderId: order.id,
            type:'premium'
          });
          await newPayment.save();
          res.status(201).json({ message: 'success', orderId: order.id });
        });
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


export default {
    OrderPremium
}