import { Request,Response } from "express"
import Course from "../../model/Course"

const PAGE_LIMIT=10

const CourseList=async (req:Request,res:Response)=>{
    try{
        let {page}=req.query ?? "1"
        const Courses=await Course.find().skip(parseInt(page as string)-1).limit(PAGE_LIMIT)
        console.log(Courses)

        res.status(200).json({message:"success",courses:Courses})
    }catch(error){
        res.status(200).json({message:"server error occured"})
    }
}

export default {
    CourseList
}