import { Request,Response } from "express";
import Chapter from "../../model/Chapter";
import mongoose from "mongoose";
import { IUser } from "../../model/User";
import { addMessageToQueue } from "../../helper/redisHelper";
import { minLengthValidator, spaceValidator, specialCharValidator } from "../../helper/validationHelper";
interface dateProps{
    '$gt':Date
}

interface queryProps{
    roadmapId:string,
    postedDate?:dateProps,
    chapterName?:RegExp
}

const PAGE_LIMIT=10


const AddChapter=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        if(user.authorization!=="admin"){
            return res.status(401).json({message:"Unauthorized"})
          }
        const {roadmapId,chapterName,quizStatus,additionalPrompt}=req.body
        if(spaceValidator(roadmapId) || spaceValidator(chapterName) || spaceValidator(additionalPrompt) ){
            return res.status(400).json({message:"bad request"})
        }
        if(minLengthValidator(roadmapId) || minLengthValidator(chapterName) || minLengthValidator(additionalPrompt) ) {
            return res.status(400).json({message:"bad request"})
        }
        if(specialCharValidator(roadmapId) || specialCharValidator(chapterName) ){
            return res.status(400).json({message:"bad request"})
        }
        const newChapter=new Chapter(
            {
                chapterName,
                roadmapId:new mongoose.Types.ObjectId(roadmapId as string),
                quizStatus,
                additionalPrompt
            }
        )
        const savedChapter=await newChapter.save()
        const sendChapter=await Chapter.findById(newChapter.id)
        //when the new chapter is created we are publishing it to the queue
        addMessageToQueue("chapter",JSON.stringify({chapterId:savedChapter.id,roadmapId:savedChapter.roadmapId}))

        res.status(200).json({message:"success",chapter:sendChapter})        
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

//admin chapter controller to just get the tags
const ListChapter=async (req:Request,res:Response)=>{
    try{

        const user=req.user as IUser
        if(user.authorization!=="admin" ){
            return res.status(401).json({message:"Unauthorized"})
        }
        let { page } = req.query ?? '1';
        const {date,search}=req.query
        let {roadmapId}=req.params
        const query:queryProps={roadmapId:roadmapId}

        if(date) query.postedDate={'$gt':new Date(date as string)}
        if(search) query.chapterName=new RegExp(search as string,'i')
        
        const length = (await Chapter.find(query)).length;
        const Chapters = await Chapter.find(query)
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

const UpdateChapter=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        if(user.authorization!=="admin"){
            res.status(401).json({message:"Unauthorized"})
        }else{
            const {chapterName,quizStatus,additionalPrompt}=req.body
            if(spaceValidator(chapterName) || spaceValidator(additionalPrompt) ){
                return res.status(400).json({message:"bad request"})
            }
            if(minLengthValidator(chapterName) || minLengthValidator(additionalPrompt) ) {
                return res.status(400).json({message:"bad request"})
            }
            if( specialCharValidator(chapterName) ){
                return res.status(400).json({message:"bad request"})
            }
            const {chapterId}=req.params
            const UpdateChapter=await Chapter.findById(chapterId)
            if(UpdateChapter){
                UpdateChapter.chapterName=chapterName ?? UpdateChapter.chapterName
                UpdateChapter.quizStatus=quizStatus ?? UpdateChapter.quizStatus
                UpdateChapter.additionalPrompt=additionalPrompt ?? UpdateChapter.additionalPrompt
                await UpdateChapter.save()
                const sendChapter=await Chapter.findById(UpdateChapter.id)
                // addMessageToQueue("chapter",JSON.stringify({chapterId:savedChapter.id,roadmapId:savedChapter.roadmapId}))
                res.status(200).json({message:"success",chapter:sendChapter})
            }else{
                res.status(404).json({message:"chapter not found"})
            }
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const DeleteChapter=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        if(user.authorization!=="admin"){
            res.status(401).json({message:"Unauthorized"})
        }else{
            const {chapterId}=req.params
            await Chapter.findByIdAndDelete(chapterId)
            res.status(200).json({message:"success"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    AddChapter,
    ListChapter,
    UpdateChapter,
    DeleteChapter
}