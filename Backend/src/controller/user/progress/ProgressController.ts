import { Request, Response } from "express";
import Progress from "../../../model/Progress";

const GetProgress=async (req:Request,res:Response)=>{
    try{
        const {courseId}=req.params
        const getProgress=await Progress.findOne({courseId:courseId}).populate('courseId').populate('progress.roadmapId').populate('progress.quizes.quizId')       
        res.status(200).json({message:"success",progress:getProgress??{}})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    GetProgress
}