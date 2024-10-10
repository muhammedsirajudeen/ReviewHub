import { Request, Response } from "express";
import Review from "../../model/Review";
import { IUser } from "../../model/User";
import Wallet from "../../model/Wallet";

const GetReviewerDashboard=async (req:Request, res: Response)=>{
    try {
        const user=req.user as IUser
        //pending reviews
        const reviewAggregation=await Review.find({reviewerId:user.id,reviewStatus:false})
        //successful reviews
        const reviewsuccessAggregation=await Review.find({reviewerId:user.id,reviewStatus:true}).populate('revieweeId')
        //wallet balance
        const walletAggregation=await Wallet.findOne({userId:user.id})
        let total=0
        if(walletAggregation){
            total=walletAggregation.balance+walletAggregation.redeemable
        }
        // and also some feedbacks to show if you can
        // const feedbackAggregation=await Review.find({reviewerId:user.id}).populate('revieweeId')

        res
          .status(200)
          .json({
            message: 'success',
            reviews: reviewAggregation,
            reviewsuccess: reviewsuccessAggregation,
            points:total,
            // feedbackaggregation:feedbackAggregation
          });
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}


export default {
    GetReviewerDashboard
}