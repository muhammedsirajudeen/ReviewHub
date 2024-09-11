import { Request,Response } from "express"
const TokenVerifier=(req:Request,res:Response)=>{
    res.json({message:"success",user:req.user})
}
export default {
    TokenVerifier
}