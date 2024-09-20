import { Request,Response } from "express";
import Razorpay from "razorpay"
import { configDotenv } from "dotenv";
configDotenv()
const OrderCreator=async (req:Request,res:Response)=>{
    try{
        const orderBody=req.body
        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID as string, key_secret: process.env.RAZORPAY_KEY_SECRET })
        var options = {
            amount: orderBody.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options, function(err, order) {
            console.log(order);
            res.status(200).json({message:"success",orderId:order.id})
          });
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    OrderCreator
}