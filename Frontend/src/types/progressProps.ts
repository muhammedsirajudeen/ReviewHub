import { courseProps, QuizProps, roadmapProps } from './courseProps';
import userProps from './userProps';

interface quizProps {
  quizId: QuizProps;
  reward: number;
  date: Date;
}
interface progressProps {
  roadmapId: roadmapProps;
  quizes: quizProps[];
}

export interface ProgressProps extends Document {
  courseId: courseProps;
  userId: userProps;
  progress: progressProps[];
}
