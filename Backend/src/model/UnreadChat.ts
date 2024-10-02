import mongoose, { Schema } from "mongoose";
import { messageProps, messageSchema } from "./Chat";




interface IUnreadChat extends Document{
    userId:mongoose.Types.ObjectId
    messageUserId:mongoose.Types.ObjectId    
    messageCount:number
}

const UnreadChatSchema=new Schema<IUnreadChat>(
    {
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        messageUserId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        messageCount:{
            type:Number,
            required:false,
            default:0
        }
    }
)
const UnreadChat=mongoose.model('unreadchat',UnreadChatSchema)
export default UnreadChat
