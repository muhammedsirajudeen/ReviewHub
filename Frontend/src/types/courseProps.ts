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

interface contentProps {
  subheading: string;
  article: string;
}

export interface sectionProps {
  sectionName: string;
  content: Array<contentProps>;
}

export interface resourceProps{
  _id:string,
  chapterName:string,
  chapterId:string,
  Section:Array<sectionProps>

}