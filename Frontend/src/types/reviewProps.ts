import { roadmapProps } from './courseProps';
interface IDetails {
  comment:string,
  star:number
}
interface feedbackProps {
  reviewerFeedback: IDetails;
  revieweeFeedback: IDetails;
}
export interface reviewProps {
  reviewerId: string;
  revieweeId: string;
  scheduledDate: string;
  instantReview: boolean;
  recordingUrl?: string;
  feedback?: feedbackProps;
  roadmapId: roadmapProps;
  _id: string;
}
