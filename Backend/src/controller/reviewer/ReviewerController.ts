import { Request,Response } from "express";


const ReviwerApproval=(req:Request,res:Response)=>{
    try{
        const {experience,domain,comment}=req.body
        const file=req.file?.filename
        console.log(experience,file)
        res.status(200).json({message:"success"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


export default {
    ReviwerApproval
}