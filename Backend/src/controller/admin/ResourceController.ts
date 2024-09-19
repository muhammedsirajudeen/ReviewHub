import { Request, Response } from 'express';
import Resource, { sectionProps } from '../../model/Resource';
import mongoose from 'mongoose';
import Quiz, { quizProps } from '../../model/Quiz';

//Get resource associated with each object
const GetResource = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const resultResource = await Resource.findOne({
      chapterId: new mongoose.Types.ObjectId(chapterId as string),
    });
    if (resultResource) {
      res.status(200).json({ message: 'success', resource: resultResource });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//get quiz associated with each chapter
const GetQuiz=async (req:Request,res:Response)=>{
    try{
        const {chapterId}=req.params
        const resultQuiz=await Quiz.findOne(
            {
                chapterId:new mongoose.Types.ObjectId(chapterId as string)
            }
        )
        if(resultQuiz){
            res.status(200).json(({message:"success",quiz:resultQuiz}))
        }else{
            res.status(404).json({message:"requested resource not found"})

        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

//edit resource here
const EditResource=async (req:Request,res:Response)=>{
  try{
    const resource=req.body as sectionProps
    const {resourceId,sectionId}=req.params
    const updateResource=await Resource.findById(resourceId)
    if(updateResource){
      updateResource.Section.forEach((section)=>{
        if(section._id===sectionId){
          section.sectionName=resource.sectionName
          section.content=resource.content
        }
        
      })
      await updateResource.save()
      res.status(200).json({message:"success"})
    }else{
      res.status(404).json({message:"requested resource not found"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}

//edit quiz here
const EditQuiz=async (req:Request,res:Response)=>{
  try{
    const {quizId}=req.params
    const quiz=req.body as quizProps
    const updateQuiz=await Quiz.findById(quizId)
    console.log(quizId)
    if(updateQuiz){
      console.log(updateQuiz)
      res.status(200).json({message:"success"})
    }else{
      res.status(404).json({message:"success"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}

export default {
  GetResource,
  GetQuiz,
  EditResource,
  EditQuiz
};
