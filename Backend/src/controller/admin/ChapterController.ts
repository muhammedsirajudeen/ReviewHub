import { Request,Response } from "express";
import Chapter from "../../model/Chapter";
import mongoose from "mongoose";
import { IUser } from "../../model/User";

const PAGE_LIMIT=10

const AddChapter=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        if(user.authorization!=="admin"){
            return res.status(401).json({message:"Unauthorized"})
          }
        const {roadmapId,chapterName}=req.body
        
        const newChapter=new Chapter(
            {
                chapterName,
                roadmapId:new mongoose.Types.ObjectId(roadmapId as string)
            }
        )
        await newChapter.save()
        res.status(200).json({message:"success"})        
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

//admin chapter controller to just get the tags
const ListChapter=async (req:Request,res:Response)=>{
    try{

        const user=req.user as IUser
        if(user.authorization!=="admin"){
            return res.status(401).json({message:"Unauthorized"})
        }
        let { page } = req.query ?? '1';
        let {roadmapId}=req.params
        const length = (await Chapter.find({roadmapId})).length;
        const Chapters = await Chapter.find({roadmapId})
          .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
          .limit(PAGE_LIMIT);
    
        res
          .status(200)
          .json({ message: 'success', chapters: Chapters ?? [], pageLength: length });
        // res.status(200).json({message:"success",chapters:Courses})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }

}

export default {
    AddChapter,
    ListChapter
}