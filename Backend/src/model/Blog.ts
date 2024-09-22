import mongoose, { mongo, Schema } from "mongoose";

export interface IBlog extends Document{
    userId:mongoose.Types.ObjectId,
    articleImage:string,
    heading:string,
    article:string,
    postedDate:Date
}


const BlogSchema=new Schema<IBlog>(
    {
        userId:{
            type:mongoose.Schema.ObjectId,
            required:true,
            unique:false,
            ref:'User'
        },
        articleImage:{
            type:String,
            required:true,
        },
        heading:{
            type:String,
            required:true,
        },
        article:{
            type:String,
            required:true
        },
        postedDate:{
            type:Date,
            required:false,
            default:new Date()
        }
    }
)

const Blog=mongoose.model<IBlog>('blogs',BlogSchema)

export default Blog