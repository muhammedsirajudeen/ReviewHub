import mongoose, { Schema } from 'mongoose';

interface resourceProps {
  subheading: string;
  article: string;
  _id:string
}

interface sectionProps {
  sectionName: string;
  content: Array<resourceProps>;
  _id:string
}

interface IResource extends Document {
  chapterName: string;
  Section: Array<sectionProps>;
  chapterId: mongoose.Types.ObjectId;
  roadmapId:mongoose.Types.ObjectId
}

const ContentSchema = new Schema<resourceProps>({
  subheading: {
    type: String,
    required: false,
    unique: false,
  },
  article: {
    type: String,
    required: false,
    unique: false,
  },
  _id:{
    type:String,
    required:false,
    unique:false
  }
});

const SectionSchema = new Schema<sectionProps>({
  sectionName: {
    type: String,
    required: false,
    unique: false,
  },
  _id:{
    type:String,
    required:false,
    unique:false
  },
  content: [ContentSchema],
});

const ResourceSchema = new Schema<IResource>({
  chapterName: {
    type: String,
    required: true,
    unique: false,
  },
  Section: {
    type: [SectionSchema],
  },
  chapterId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
  roadmapId:{
    type:mongoose.Schema.ObjectId,
    required:true,
    unique:false
  }
});

const Resource = mongoose.model('resource', ResourceSchema);

export default Resource;
