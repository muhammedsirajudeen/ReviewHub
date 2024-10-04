import mongoose, { Schema } from 'mongoose';

interface IFeedback extends Document {
  reviewerFeedback: string;
  revieweeFeedback: string;
}

interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  instantReview: boolean;
  recordingUrl?: string;
  feedback?: IFeedback;
  reviewStatus:boolean
}

const FeedbackSchema = new Schema<IFeedback>({
  revieweeFeedback: String,
  reviewerFeedback: String,
});

const ReviewSchema = new Schema<IReview>({
  reviewerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  revieweeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  instantReview: {
    type: Boolean,
    required: false,
    default: false,
  },
  recordingUrl: {
    type: String,
    required: false,
  },
  feedback: {
    type: FeedbackSchema,
    required: false,
  },
  reviewStatus:{
    type:Boolean,
    required:true
  }
});

const Review = mongoose.model<IReview>('review', ReviewSchema);

export default Review;
