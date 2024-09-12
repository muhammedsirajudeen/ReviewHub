import mongoose, { Schema } from "mongoose"

interface IChapter extends Document{
    chapterName:string,
    roadmapId:mongoose.Schema.Types.ObjectId
}

const ChapterSchema=new Schema<IChapter>(
    {
        chapterName:{
            type:String,
            required:true,
            unique:true
        },
        roadmapId:{
            type:mongoose.Schema.ObjectId,
            required:true,
            unique:false
        }
    }
)
const Chapter=mongoose.model<IChapter>("chapter",ChapterSchema)
export default Chapter