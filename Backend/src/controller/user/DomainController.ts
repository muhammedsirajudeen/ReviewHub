import { Request, Response } from "express";
import Domain from "../../model/Domain";

const DomainController=async (req:Request,res:Response)=>{
    try{
        const domains=await Domain.find()
        res.status(200).json({message:"success",domains:domains})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}


export default {
    DomainController
}