import { Request, Response } from "express";
import User from "../../../model/User";

interface queryProps{
    email?:RegExp
}

const GetUsers=async (req:Request,res:Response)=>{
    try{
        const {search}=req.query
        const query:queryProps={}
        if(query) query.email=new RegExp(search as string,'i') 
        const Users = await User.find(query).select('email profileImage')
        res.status(200).json({message:'success',users:Users})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}

export default {
    GetUsers
}