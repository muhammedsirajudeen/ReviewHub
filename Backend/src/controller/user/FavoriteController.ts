import { Request, Response } from "express";
import { IUser } from "../../model/User";
import mongoose from "mongoose";

const AddFavorite=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const {courseId}=req.params
        const exists=user.favoriteCourses.includes(new mongoose.Types.ObjectId(courseId))
        if(exists){
            const index=user.favoriteCourses.indexOf(new mongoose.Types.ObjectId(courseId))
            user.favoriteCourses.splice(index,1)
            await user.save()
            res.status(200).json({message:"success"})
        }else{
            user.favoriteCourses.push(new mongoose.Types.ObjectId(courseId))
            await user.save()
            res.status(201).json({message:"success"})

        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}



export default {
    AddFavorite
}