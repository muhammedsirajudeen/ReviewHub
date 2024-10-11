export enum Type {
  Review = 'review',
}
export interface notificationProps {
  message: string;
  userId: string;
  type: Type;
  date: string;
  _id: string;
  reviewId: string;
}
