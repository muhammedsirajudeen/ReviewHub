import { Request, Response } from "express";
import Progress from "../../../model/Progress";
import { IUser } from "../../../model/User";

const GetProgress=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const {courseId}=req.params
        const getProgress=await Progress.findOne({userId:user.id,courseId:courseId}).populate('courseId').populate('progress.roadmapId').populate('progress.quizes.quizId')       
        res.status(200).json({message:"success",progress:getProgress??{}})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    GetProgress
}