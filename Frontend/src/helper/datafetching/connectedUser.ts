import { Dispatch, RefObject, SetStateAction } from 'react';
import userProps from '../../types/userProps';
import axiosInstance from '../axiosInstance';
import { ExtendedUser } from '../../pages/User/Chat';

const getConnectedUser = async (
  setResult: Dispatch<
    SetStateAction<Array<Pick<userProps, '_id' | 'email' | 'profileImage'>>>
  >,
  onlineDataRef: RefObject<Record<string, boolean>>
) => {
  const response = (await axiosInstance.get('/user/chat/connected')).data;
  if (response.message === 'success') {
    console.log(response);
    setResult(response.users ?? []);
    const users = response.users as ExtendedUser[];
    users.forEach((user) => {
      if (user.online) {
        if (onlineDataRef.current) {
          onlineDataRef.current[user.email] = true;
        }
      } else {
        if (onlineDataRef.current) {
          onlineDataRef.current[user.email] = false;
        }
      }
    });
  } else {
    setResult([]);
  }
};

export default getConnectedUser;
