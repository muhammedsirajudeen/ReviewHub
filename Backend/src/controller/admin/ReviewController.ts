import { Request,Response } from "express";
import Review from "../../model/Review";

const ReviewController=async (req:Request,res:Response)=>{
    try{
        const Reviews=await Review.find().populate('revieweeId').populate('reviewerId').populate('roadmapId')
        res.status(200).json({message:'success',reviews:Reviews})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}


export default {
    ReviewController
}