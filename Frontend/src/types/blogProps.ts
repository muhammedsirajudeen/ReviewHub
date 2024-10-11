import userProps from './userProps';

export interface blogProps {
  _id: string;
  userId: userProps;
  articleImage: string;
  heading: string;
  article: string;
  postedDate: string;
}
