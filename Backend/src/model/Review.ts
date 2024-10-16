import mongoose, { Schema } from 'mongoose';

interface IDetails {
  comment: string;
  star: number;
}

export interface IFeedback {
  reviewerFeedback: IDetails;
  revieweeFeedback: IDetails;
}

export interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  instantReview: boolean;
  recordingUrl?: string;
  feedback?: IFeedback;
  reviewStatus: boolean;
  roadmapId: mongoose.Types.ObjectId;
  domainName: string;
}

const DetailsSchema = new Schema<IDetails>({
  comment: String,
  star: Number,
});

const FeedbackSchema = new Schema<IFeedback>({
  revieweeFeedback: DetailsSchema,
  reviewerFeedback: DetailsSchema,
});

const ReviewSchema = new Schema<IReview>({
  reviewerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  revieweeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  scheduledDate: {
    type: Date,
    required: false,
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
  reviewStatus: {
    type: Boolean,
    required: true,
  },
  roadmapId: {
    type: mongoose.Schema.ObjectId,
    ref: 'roadmap',
    required: false,
  },
  domainName: {
    type: String,
    ref: 'roadmap',
    required: false,
  },
});

const Review = mongoose.model<IReview>('review', ReviewSchema);

export default Review;
