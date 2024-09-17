import { Request, Response } from 'express';
import Resource from '../../model/Resource';
import mongoose from 'mongoose';
import Quiz from '../../model/Quiz';

//Get resource associated with each object
const GetResource = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const resultResource = await Resource.findOne({
      chapterId: new mongoose.Types.ObjectId(chapterId as string),
    });
    console.log(resultResource);
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

export default {
  GetResource,
  GetQuiz
};
