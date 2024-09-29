import mongoose, { mongo } from 'mongoose';

interface quizProps {
  quizId: string;
  reward: number;
}

interface progressProps {
  roadmapId: mongoose.Types.ObjectId;
  quizes: quizProps[];
}

interface IProgress extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  progress: progressProps[];
}

const quizSchema = new mongoose.Schema<quizProps>({
  quizId: mongoose.Schema.ObjectId,
  reward: Number,
});

const IndiProgressSchema = new mongoose.Schema<progressProps>({
  roadmapId: {
    type:mongoose.Schema.ObjectId,
    ref:'roadmap'
  },
  quizes: [quizSchema],
});

const ProgressSchema = new mongoose.Schema<IProgress>({
  courseId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    ref: 'courses',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
  progress: {
    type: [IndiProgressSchema],
    required: false,
    default: [],
  },
});

const Progress = mongoose.model<IProgress>('progress', ProgressSchema);
export default Progress;
