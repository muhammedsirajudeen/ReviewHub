import { Request, Response } from "express";
import { IUser } from "../../../model/User";
import Review from "../../../model/Review";
import { PAGE_LIMIT } from "../CourseController";

const GetHistory=async (req:Request,res:Response)=>{
    try {
        const {page}=req.query
        const user=req.user as IUser
        const length=(await Review.find()).length
        if(user.authorization==="reviewer"){

            const reviewHistory=await Review.find({reviewerId:user.id,reviewStatus:true}).populate(['roadmapId','revieweeId'])
            .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
            .limit(PAGE_LIMIT);
            res.status(200).json({message:'success',reviews:reviewHistory,pageLength:length})
        }else{

            const reviewHistory=await Review.find({revieweeId:user.id,reviewStatus:true}).populate('roadmapId').populate('reviewerId')
            .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
            .limit(PAGE_LIMIT);

            res.status(200).json({message:'success',reviews:reviewHistory,pageLength:length})

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}



export default {
    GetHistory
}