import { Request, Response } from "express";
import Payment from "../../model/Payment";
import { PAGE_LIMIT } from "../user/CourseController";

const GetPayments = async  (req:Request,res:Response)=>{
    try{
        const {page}=req.query ?? '1'
        const length=(await Payment.find()).length
        const Payments=await Payment.find().populate('userId').skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
        res.status(200).json({message:"success",payments:Payments,pageLength:length})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


export default {
    GetPayments
}