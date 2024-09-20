import { Request,Response } from "express"
import { IUser } from "../../model/User"
const TokenVerifier=(req:Request,res:Response)=>{
    const user=req.user as IUser
    if(user.verified){
        res.status(200).json({message:"success",user:req.user})
    }else{
        res.status(401).json({message:"unauthorized"})
    }
}
export default {
    TokenVerifier
}