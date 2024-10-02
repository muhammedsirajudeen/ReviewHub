import { Request, Response } from "express";
import User, { IUser } from "../../../model/User";
import Chat, { IChat } from "../../../model/Chat";
import mongoose from "mongoose";
import { resolveSoa } from "dns";
import UnreadChat from "../../../model/UnreadChat";

interface queryProps{
    email?:RegExp
}

const GetUsers=async (req:Request,res:Response)=>{
    try{
        const {search,email}=req.query
        const query:queryProps={}
        if(email){
            const user=await User.findOne({email:email}).select(['email','profileImage'])
            return res.status(200).json({message:"success",user:user})
        }
        if(query) query.email=new RegExp(search as string,'i') 
        const Users = await User.find(query).select('email profileImage')
        res.status(200).json({message:'success',users:Users})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error occured'})
    }
}




interface ExtendedUser extends Pick<IUser,'email' | 'profileImage'>{
    _id:string
}

const GetConnectedUsers=async (req:Request,res:Response)=>{
    try{
        const currentuser=req.user as IUser
        const findUsers=await Chat.find({userId:{$in:[new mongoose.Types.ObjectId(currentuser.id as string)]}}).populate('userId','email profileImage')
        const connectedUsers:ExtendedUser[]=[]
        //optimize this method as the last stage
        if(findUsers.length!==0){
            findUsers.forEach((chat)=>{
                chat.userId.forEach((user)=>{
                    const userId=user._id as mongoose.Types.ObjectId
                    user=user as IUser
                    console.log(userId.toHexString()!==currentuser.id)
                    if(userId.toHexString()!==currentuser.id){
                        connectedUsers.push({_id:userId.toHexString(),email:user.email,profileImage:user.profileImage})
                    }
                })
            })
            //populate with username and email
            res.status(200).json({message:"success",users:connectedUsers})
        }else{
            return res.status(404).json({message:"chat not found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const GetHistory=async (req:Request,res:Response)=>{
    try{
        const {recieverId}=req.body
        const user=req.user as IUser
        const findChat=await Chat.findOne({userId:{$all:[new mongoose.Types.ObjectId(user.id as string),new mongoose.Types.ObjectId(recieverId as string)]}})
        if(findChat){
            
            res.status(200).json({message:"success",history:findChat.messages})
        }else{
            res.status(404).json({message:"no history"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const GetUnread=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const unreadChats=await UnreadChat.find({messageUserId:user.id}).populate('userId','email')
        console.log(unreadChats)

        //additional logic after this
        res.status(200).json({message:"success",unread:unreadChats})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}
export default {
    GetUsers,
    GetConnectedUsers,
    GetHistory,
    GetUnread
}