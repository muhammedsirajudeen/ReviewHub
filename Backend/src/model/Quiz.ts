import mongoose, { Schema } from 'mongoose';

export interface quizProps {
  question: string;
  answer: string;
  options: Array<string>;
  reward: number;
  _id: string;
  multiselect: boolean;
}

interface IQuiz extends Document {
  chapterName: string;
  roadmapId: mongoose.Types.ObjectId;
  Quiz: Array<quizProps>;
  chapterId: mongoose.Types.ObjectId;
}

const questionSchema = new Schema<quizProps>({
  question: {
    type: String,
    required: true,
    unique: false,
  },
  answer: {
    type: String,
    required: true,
    unique: false,
  },
  options: {
    type: [String],
    required: true,
    unique: false,
  },
  reward: {
    type: Number,
    required: true,
    unique: false,
  },
  _id: {
    type: String,
    required: true,
    unique: false,
  },
  multiselect: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const QuizSchema = new Schema<IQuiz>({
  chapterName: {
    type: String,
    required: true,
    unique: false,
  },
  roadmapId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
  Quiz: {
    type: [questionSchema],
    required: true,
    unique: false,
  },
  chapterId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
});

const Quiz = mongoose.model<IQuiz>('quizes', QuizSchema);

export default Quiz;
