import mongoose, { Schema } from 'mongoose';

interface IChapter extends Document {
  chapterName: string;
  roadmapId: mongoose.Schema.Types.ObjectId;
  quizStatus: boolean;
  additionalPrompt: string;
  postedDate: Date;
}

const ChapterSchema = new Schema<IChapter>({
  chapterName: {
    type: String,
    required: true,
    unique: true,
  },
  roadmapId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
  quizStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  additionalPrompt: {
    type: String,
    required: true,
    unique: false,
  },
  postedDate: {
    type: Date,
    required: false,
    unique: false,
    default: new Date(),
  },
});
const Chapter = mongoose.model<IChapter>('chapter', ChapterSchema);
export default Chapter;
