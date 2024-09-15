export interface courseProps {
  _id: string;
  courseName: string;
  courseDescription: string;
  domain: string;
  courseImage: string;
  tagline: string;
}

export interface roadmapProps {
  _id: string;
  roadmapName: string;
  roadmapDescription: string;
  courseId: string;
  lessonCount: number;
  roadmapImage: string;
}
export interface chapterProps {
  _id: string;
  chapterName: string;
  roadmapId: string;
  quizStatus: boolean;
  additionalPrompt: string;
}
