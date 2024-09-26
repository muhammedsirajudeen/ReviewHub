import { Request, Response } from "express";

const GetProgress=async (req:Request,res:Response)=>{
    try{
        res.status(200).json({message:"success"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}