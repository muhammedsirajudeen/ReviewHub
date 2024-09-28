export interface chatProps {
  userId: string;
  messages: {
    from: string | undefined;
    to: string | undefined;
    message: string | undefined;
    time: Date;
    _id?: string | undefined;
  }[];
}
