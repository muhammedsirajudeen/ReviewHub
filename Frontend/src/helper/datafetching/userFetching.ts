import { Dispatch, SetStateAction } from 'react';
import userProps from '../../types/userProps';
import axiosInstance from '../axiosInstance';

export async function getUsers(
  search: string,
  setUsers: Dispatch<SetStateAction<Array<userProps>>>
) {
  try {
    const response = (
      await axiosInstance.get(`/user/chat/users?search=${search}`)
    ).data;
    console.log(response);
    if (response.message === 'success') {
      setUsers(response.users);
    } else {
      console.log(response.message);
    }
  } catch (error) {
    console.log(error);
  }
}
