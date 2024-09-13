import { Request, Response } from 'express';
import Roadmap from '../../model/Roadmap';
import { IUser } from '../../model/User';
import mongoose from 'mongoose';



const AddRoadmap = async (req: Request, res: Response) => {
  const { roadmapName, roadmapDescription, courseId } = req.body;
  const user=req.user as IUser
  if(user.authorization!=="admin"){
    res.status(401).json({message:"Unauthorized"})
  }
  console.log(roadmapName, roadmapDescription, courseId);
  try {
    const RoadMaps = await Roadmap.find({ courseId });
    console.log(RoadMaps)
    if (RoadMaps.length === 0) {
      //asserting that this is the first roadmap
      const lessonCount = 1;
      const newRoadmap = new Roadmap({
        lessonCount,
        courseId:new mongoose.Types.ObjectId(courseId as string),
        roadmapName,
        roadmapDescription,
      });
      await newRoadmap.save();
      res.status(201).json({ message: 'success' });
    } else {
      //we found that the lesson count is not one
      const maxLesson = Math.max(
        ...RoadMaps.map((Roadmap) => Roadmap.lessonCount)
      );
      const lessonCount = maxLesson + 1;
      const newRoadmap = new Roadmap({
        lessonCount,
        courseId,
        roadmapName,
        roadmapDescription,
      });
      await newRoadmap.save();
      res.status(201).json({ message: 'success' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const EditRoadmap=async (req:Request,res:Response)=>{
  try{
    const user = req.user as IUser
    if(user.authorization!=="admin"){
      res.status(401).json({message:"Unauthorized"})
    }else{
      const {roadmapName,roadmapDescription}=req.body
      const {roadmapId}=req.params
      const updateRoadmap=await Roadmap.findById(roadmapId)
      if(updateRoadmap){
        updateRoadmap.roadmapName=roadmapName ?? updateRoadmap.roadmapName
        updateRoadmap.roadmapDescription=roadmapDescription ?? updateRoadmap.roadmapDescription
        await updateRoadmap.save()
        res.status(200).json({message:"success"})
      }else{
        res.status(404).json({message:"roadmap not found"})
      }
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}

const DeleteRoadmap=async (req:Request,res:Response)=>{
  try{
    const user=req.user as IUser
    if(user.authorization!=="admin"){
      res.status(401).json({message:"success"})
    }else{
      const {roadmapId}=req.params
      await Roadmap.findByIdAndDelete(roadmapId)
      res.status(200).json({message:"success"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}



export default {
  AddRoadmap,
  EditRoadmap,
  DeleteRoadmap
};
