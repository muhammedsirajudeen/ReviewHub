import mongoose, { Schema } from 'mongoose';

export interface IRoadmap extends Document {
  roadmapName: string;
  roadmapDescription: string;
  courseId: mongoose.Types.ObjectId;
  lessonCount: number;
  postedDate: Date;
  roadmapImage: string;
  unlistStatus: boolean;
}
//validate this model
const RoadmapSchema = new Schema<IRoadmap>({
  lessonCount: {
    type: Number,
    required: true,
    unique: false,
  },
  roadmapName: {
    type: String,
    required: true,
    unique: true,
  },
  roadmapDescription: {
    type: String,
    required: true,
    unique: false,
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
    ref:'courses'
  },
  postedDate: {
    type: Date,
    default: new Date(),
    required: true,
  },
  roadmapImage: {
    type: String,
    required: true,
    unique: false,
  },
  unlistStatus: {
    type: 'Boolean',
    required: false,
    unique: false,
  },
});

const Roadmap = mongoose.model<IRoadmap>('roadmap', RoadmapSchema);
export default Roadmap;
