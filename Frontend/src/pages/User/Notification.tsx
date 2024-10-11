import { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import DashboardTopbar from '../../components/DashboardTopbar';
import { notificationProps, Type } from '../../types/notificationProps';
import axiosInstance from '../../helper/axiosInstance';
import { AxiosError } from 'axios';
import { FaBell, FaSadCry, FaStar, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import { produce } from 'immer';
import { useNavigate } from 'react-router';

export default function Notification(): ReactElement {
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<notificationProps[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setPage('notification'));
    async function notificationFetcher() {
      try {
        const response = (await axiosInstance.get('/user/notification')).data;
        if (response.message === 'success') {
          setNotifications(response.notifications);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
      }
    }
    notificationFetcher();
  }, [dispatch]);
  const deleteHandler = async (notification: notificationProps) => {
    try {
      const response = (
        await axiosInstance.delete(`/user/notification/${notification._id}`)
      ).data;
      if (response.message === 'success') {
        toast.success('Deleted Successfully');
        setNotifications(
          produce((draft) => {
            return draft.filter((d) => d._id !== notification._id);
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    }
  };
  const joinHandler = (notification: notificationProps) => {
    try {
      navigate('/user/videochat', { state: notification.reviewId });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <DashboardTopbar />
      <h1 className="ml-36 text-4xl   text-gray-800">NOTIFICATIONS</h1>
      <div className="flex flex-col items-center mt-8">
        {notifications.length === 0 && (
          <div className="w-3/4 flex items-center justify-center flex-col bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 h-24 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <FaSadCry className="text-gray-400" size={50} />
            <p className="text-sm font-semibold mt-3 text-gray-600">
              No Notifications at the Moment
            </p>
          </div>
        )}

        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 mb-4 w-2/3 flex justify-between items-center"
          >
            <button onClick={() => deleteHandler(notification)}>
              <FaTrash />
            </button>
            <div className="flex items-center">
              {notification.type === Type.Review ? (
                <FaStar className="text-yellow-500 mr-2" />
              ) : (
                <FaBell className="text-blue-500 mr-2" />
              )}
              <div className="text-left">
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.date))} ago
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`text-sm font-medium mr-4 ${
                  notification.type === Type.Review
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`}
              >
                {notification.type}
              </span>
              {notification.type === Type.Review && (
                <button
                  onClick={() => joinHandler(notification)}
                  className="bg-blue-500 ml-72 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
        <ToastContainer
          style={{
            backgroundColor: 'gray',
            color: 'white',
            borderRadius: '10px',
          }}
        />
      </div>
    </>
  );
}
