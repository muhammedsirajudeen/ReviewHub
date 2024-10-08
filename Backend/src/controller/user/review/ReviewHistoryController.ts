import { Request, Response } from "express";
import { IUser } from "../../../model/User";
import Review from "../../../model/Review";

const GetHistory=async (req:Request,res:Response)=>{
    try {
        const user=req.user as IUser
        if(user.authorization==="reviewer"){
            const reviewHistory=await Review.find({reviewerId:user.id,reviewStatus:true}).populate('roadmapId')
            res.status(200).json({message:'success',reviews:reviewHistory})
        }else{
            const reviewHistory=await Review.find({revieweeId:user.id,reviewStatus:true}).populate('roadmapId')
            res.status(200).json({message:'success',reviews:reviewHistory})

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}



export default {
    GetHistory
}