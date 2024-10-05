export interface courseProps {
  _id: string;
  courseName: string;
  courseDescription: string;
  domain: string;
  courseImage: string;
  tagline: string;
  unlistStatus: boolean;
  postedDate:string
}

export interface roadmapProps {
  _id: string;
  roadmapName: string;
  roadmapDescription: string;
  courseId: string;
  lessonCount: number;
  roadmapImage: string;
  unlistStatus:boolean
}
export interface chapterProps {
  _id: string;
  chapterName: string;
  roadmapId: string;
  quizStatus: boolean;
  additionalPrompt: string;
  unlistStatus: boolean;
}

export interface contentProps {
  subheading: string;
  article: string;
  _id: string;
}

export interface sectionProps {
  sectionName: string;
  content: Array<contentProps>;
  _id: string;
}

export interface resourceProps {
  _id: string;
  chapterName: string;
  chapterId: string;
  Section: Array<sectionProps>;
}

export interface quizProps {
  question: string;
  answer: string;
  options: Array<string>;
  reward: number;
  _id: string;
}

export interface QuizProps {
  chapterName: string;
  roadmapId: string;
  Quiz: Array<quizProps>;
  chapterId: string;
  _id: string;
}



export interface responseProps {
  question: string;
  reward: number;
}


export interface domainProps {
  domain: string;
  _id?:string
}