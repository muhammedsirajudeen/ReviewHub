import { Request,Response } from "express";
import Razorpay from "razorpay"
import { configDotenv } from "dotenv";
import { addValueToCache, getValueFromCache } from "../../../helper/redisHelper";
import verifyPayment from "../../../helper/signatureVerifier";
import Payment from "../../../model/Payment";
import { IUser } from "../../../model/User";
import mongoose, { Document } from "mongoose";
import Wallet from "../../../model/Wallet";
configDotenv()
interface razorpayProps{
    
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
      
}

const OrderCreator=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser

        const orderBody=req.body
        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID as string, key_secret: process.env.RAZORPAY_KEY_SECRET })
        var options = {
            amount: orderBody.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options,async  function(err, order) {
            let newPayment=new Payment(
                {
                    amount:parseInt(orderBody.amount)/100,
                    userId:user.id,
                    orderId:order.id
                }
            )
            await newPayment.save()
            res.status(200).json({message:"success",order:order})
          });
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const OrderVerifier=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const razorpay=req.body as razorpayProps


        const updatePayment=await Payment.findOne({orderId:razorpay.razorpay_order_id})
        const userWallet=await Wallet.findOne({userId:new mongoose.Types.ObjectId(user.id as string)})
        
        const verifiedStatus=verifyPayment(updatePayment?.orderId as string,razorpay.razorpay_payment_id,razorpay.razorpay_signature,process.env.RAZORPAY_KEY_SECRET as string)
        console.log(verifiedStatus)
        if(!verifiedStatus){
            res.status(400).json({message:"request malformed"})
            return
        }
        if(updatePayment && userWallet ){
            updatePayment.status=true
            await updatePayment.save()
                userWallet.balance+=updatePayment.amount
                userWallet.history.push(
                    {
                        paymentDate:new Date(),
                        amount:updatePayment.amount,
                        type:'payment'
                    }
                )
                userWallet.redeemable+=updatePayment.amount
                await userWallet.save()
                res.status(201).json({message:"success"})
        }else{
            res.status(404).json({message:"resource not found"})
        }

    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    OrderCreator,
    OrderVerifier
}