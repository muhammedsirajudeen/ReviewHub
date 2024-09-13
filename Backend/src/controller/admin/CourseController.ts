import { Request, Response } from 'express';
import Course from '../../model/Course';
import { IUser } from '../../model/User';

//add course here
const AddCourse = async (req: Request, res: Response) => {
  let { courseName, courseDescription, domain, tagline } = req.body;

  let userhere = req.user as IUser;
  if (userhere.authorization !== 'admin') {
    return res.status(403).json({ message: 'insufficient permissions' });
  }
  try {
    let checkCourse = await Course.findOne({ courseName: courseName });
    if (checkCourse) {
      res.status(409).json({ message: 'course already exists' });
    } else {
      const newCourse = new Course({
        courseName,
        courseDescription,
        domain,
        tagline,
        courseImage: req.file?.filename,
      });
      await newCourse.save();
      res.json({ message: 'success' });
    }
  } catch (error) {
    res.status(500).json({ message: 'server error occured' });
  }
};

//update the course here
const UpdateCourse=async (req:Request,res:Response)=>{
  
  try{
    const user=req.user as IUser
    if(user.authorization!=="admin"){
      res.status(401).json({message:"Unauthorized"})
    }else{
      let {courseId,courseName,courseDescription,domain,tagline}=req.body
      const checkCourse=await Course.findById(courseId)
      if(checkCourse){
        //partially updating the contents
        checkCourse.courseName=courseName ?? checkCourse.courseName
        checkCourse.courseDescription=courseDescription ?? checkCourse.courseDescription
        checkCourse.domain=domain ?? checkCourse.domain
        checkCourse.tagline=tagline ?? checkCourse.tagline
        checkCourse.courseImage=req.file?.filename ?? checkCourse.courseImage
        await checkCourse.save()
        res.status(200).json({message:"success"})
      }else{
        res.status(404).json({message:"No course found"})
      }
    }

  }catch(error){
    console.log(error)
    res.status(500).json({message:"success"})
  }
}

//delete the course
const DeleteCourse=async (req:Request,res:Response)=>{
  
  try{
    const user=req.user as IUser
    if(user.authorization!=="admin"){
      res.status(401).json({message:"Unauthorized"})
      
    }else{
      const {courseId}=req.params
      const deleteCourse=await Course.findByIdAndDelete(courseId)
      res.status(200).json({message:"success"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:"server error occured"})
  }
}




export default {
  AddCourse,
  UpdateCourse,
  DeleteCourse
};
