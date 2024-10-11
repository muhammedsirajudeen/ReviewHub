export interface chatmessageProps {
  from: string | undefined;
  to: string | undefined;
  message: string | undefined;
  time: string;
  _id?: string | undefined;
  uuid: string | undefined;
  repliedto?: string | undefined;
}
export interface chatProps {
  userId: string;
  messages: chatmessageProps[];
}
