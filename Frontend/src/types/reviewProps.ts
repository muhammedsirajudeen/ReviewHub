import { roadmapProps } from "./courseProps";

interface feedbackProps {
    reviewerFeedback: string;
    revieweeFeedback: string;
  }
export interface reviewProps  {
    reviewerId: string;
    revieweeId: string;
    scheduledDate: Date;
    instantReview: boolean;
    recordingUrl?: string;
    feedback?: feedbackProps;
    roadmapId:roadmapProps
}

  