import { Request, Response } from "express";
import { IUser } from "../../../model/User";
import Review from "../../../model/Review";

const GetReview=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        //alter this code to handle the reviewer side as well
        const userReviews=await Review.find({revieweeId:user.id})
        res.status(200).json({message:"success",reviews:userReviews})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    GetReview
}