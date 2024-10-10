import { Request, Response } from "express";
import Course from "../../../model/Course";
import { IUser } from "../../../model/User";
import Review from "../../../model/Review";
import Wallet from "../../../model/Wallet";

const GetAnalytics=async (req:Request,res: Response)=>{
    try {
        const user=req.user as IUser
        //course aggregation
        const courseAggregation=await Course.find({_id:{$in:user.enrolledCourses}})
        //review count
        const reviewAggregation=await Review.find({revieweeId:user.id,scheduledDate:{$exists:true}})
        //compeleted review
        const completedreviewAggregation=await Review.find({revieweeId:user.id,reviewStatus:true})
        //rest of the points
        const walletAggregation=await Wallet.findOne({userId:user.id})
        let points=0
        if(walletAggregation){
            points=walletAggregation.redeemable+walletAggregation.balance
        }
        res.status(200).json({message:'success',courses:courseAggregation,reviews:reviewAggregation,completedreviews:completedreviewAggregation,points: points ?? 0})
             
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}


export default {
    GetAnalytics
}