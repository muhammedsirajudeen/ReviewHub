import { Request, Response } from "express";
import Review from "../../model/Review";
import { PAGE_LIMIT } from "../user/CourseController";

const GetReviews=async (req:Request,res:Response)=>{
    try{
        let { page } = req.query ?? '1';
        const length=(await Review.find()).length
        const Reviews=await Review.find({reviewStatus:false,scheduledDate:{$exists:true}}).populate('roadmapId')
        .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT);
        
        res.status(200).json({message:"success",reviews:Reviews,pageLength:length})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


export default {
    GetReviews
}