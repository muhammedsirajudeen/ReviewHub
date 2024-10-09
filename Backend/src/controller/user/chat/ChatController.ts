import { Request, Response } from "express";
import User, { IUser } from "../../../model/User";
import Chat from "../../../model/Chat";
import mongoose from "mongoose";
import UnreadChat from "../../../model/UnreadChat";
import { getValueFromCache } from "../../../helper/redisHelper";

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
    online?:boolean
}


const PromiseWrapper=(connectedUsers:ExtendedUser[]):Promise<ExtendedUser[]>=>{
    return new Promise(async (resolve,reject)=>{
        try{
            for(let i=0;i<connectedUsers.length;i++){
                const socketId:string=await getValueFromCache(`socket-${connectedUsers[i]._id}`)
                if(socketId){
                    connectedUsers[i].online=true
                }else{
                    connectedUsers[i].online=false
                }
            }
            resolve(connectedUsers)
        }catch(error){
            reject(error)
        }
    }) 
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
                    if(userId.toHexString()!==currentuser.id){
                        connectedUsers.push({_id:userId.toHexString(),email:user.email,profileImage:user.profileImage})
                    }
                })
            })
            //populate with username and email
            connectedUsers.forEach(async   (connectedUser)=>{
                const id=await getValueFromCache(`socket-${connectedUser._id}`)
                if(id){
                    connectedUser.online=true
                }else{
                    connectedUser.online=false
                }

            })
            const onlineConnectedUsers=await PromiseWrapper(connectedUsers)

            res.status(200).json({message:"success",users:onlineConnectedUsers})
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

        //additional logic after this
        res.status(200).json({message:"success",unread:unreadChats})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

const ClearUnread=async (req:Request,res:Response)=>{
    const {userId,messageUserId}=req.body

    try{
        const unreadChat=await UnreadChat.findOne({userId:userId,messageUserId:messageUserId})
        if(unreadChat){

            unreadChat.messageCount=0
            unreadChat.save()
        }
        res.status(200).json({message:"success"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
}

export default {
    GetUsers,
    GetConnectedUsers,
    GetHistory,
    GetUnread,
    ClearUnread
}