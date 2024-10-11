import { Dispatch, RefObject, SetStateAction } from 'react';
import { chatProps } from '../../types/chatProps';
import axiosInstance from '../axiosInstance';
import { flushSync } from 'react-dom';

export const historyFetching = async (
  recieverId: string,
  email: string,
  setResult: Dispatch<SetStateAction<Array<chatProps>>>,
  ref: RefObject<HTMLDivElement>
) => {
  try {
    const response = (
      await axiosInstance.post('/user/chat/history', { recieverId })
    ).data;
    if (response.message === 'success') {
      flushSync(() => {
        setResult([{ userId: email, messages: response.history }]);
      });
      if (ref.current) {
        // alert("scrolling")
        ref.current.scrollTop = ref.current?.scrollHeight;
      }
    } else {
      setResult([]);
    }
  } catch (error) {
    console.log(error);
    setResult([]);
  }
};
