import mongoose, { Schema } from "mongoose"

interface IRoadmap extends Document{
    roadmapName:string,
    roadmapDescription:string,
    courseId:mongoose.Types.ObjectId,
    lessonCount:number,
    postedDate:Date,
    roadmapImage:string
}
//validate this model 
const RoadmapSchema=new Schema<IRoadmap>(
    {
        lessonCount:{
            type:Number,
            required:true,
            unique:false
        },
        roadmapName:{
            type:String,
            required:true,
            unique:true,
            
        },
        roadmapDescription:{
            type:String,
            required:true,
            unique:false
        },
        courseId:{
            type:mongoose.Schema.ObjectId,
            required:true,
            unique:false
        },
        postedDate:{
            type:Date,
            default:new Date(),
            required:true
        },
        roadmapImage:{
            type:String,
            required:true,
            unique:false
        }
    }
)



const Roadmap=mongoose.model<IRoadmap>("roadmap",RoadmapSchema)
export default Roadmap