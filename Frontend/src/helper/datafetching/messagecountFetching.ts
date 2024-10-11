import { Dispatch, SetStateAction } from 'react';
import { messageCount } from '../../pages/User/Chat';
import axiosInstance from '../axiosInstance';
import userProps from '../../types/userProps';

interface unread {
  messageCount: number;
  messageUserId: string;
  userId: userProps;
}

const messagecountFetching = async (
  setResult: Dispatch<SetStateAction<messageCount[]>>
) => {
  try {
    const response = (await axiosInstance.get('/user/chat/unread')).data;
    if (response.message === 'success') {
      console.log(response);
      const chatCount: messageCount[] = [];
      response.unread.forEach((unread: unread) => {
        chatCount.push({
          userId: unread.userId.email,
          messageCount: unread.messageCount,
        });
      });
      setResult(chatCount);
    }
  } catch (error) {
    console.log(error);
  }
};

export default messagecountFetching;
