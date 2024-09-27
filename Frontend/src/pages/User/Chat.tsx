import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { io, Socket } from 'socket.io-client';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';
import ChatTopBar from '../../components/Topbar/ChatTopBar';
import userProps from '../../types/userProps';
import ChatFindDialog from '../../components/Dialog/ChatFindDialog';
import { SubmitHandler, useForm } from 'react-hook-form';
import { chatProps } from '../../types/chatProps';
import { v4 } from 'uuid';
import getConnectedUser from '../../helper/datafetching/connectedUser';
import { historyFetching } from '../../helper/datafetching/historyFetching';
import { flushSync } from 'react-dom';

const socketConnect = () => {
  toast('Connected successfully', { type: 'success' });
};

export default function Chat(): ReactElement {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<Array<userProps>>([]);
  const [chatfind, setChatfind] = useState<boolean>(false);
  const chatFindDialogRef = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState<userProps | null>(null);
  const [chats, setChats] = useState<Array<chatProps>>([]);
  const currentUser = useAppSelector((state) => state.global.user);
  const [connectedusers, setConnectedusers] = useState<Array<userProps>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  interface messageProps {
    message: string;
  }

  const { register, handleSubmit, reset } = useForm<messageProps>();

  useEffect(() => {
    dispatch(setPage('chat'));
    //fetching connected users first
    getConnectedUser(setConnectedusers);

    const socket = io(url, {
      auth: {
        token: window.localStorage.getItem('token'),
      },
    });

    socket.on('connect', socketConnect);
    socket.on('message', (msg) => {
      console.log(msg);
      const message = JSON.parse(msg);
      flushSync(() => {
        setChats((prev) => [...prev, message]);
      });
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current?.scrollHeight;
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  useEffect(() => {
    setChats([]);
    historyFetching(user?._id as string, setChats, chatContainerRef);
  }, [user]);
  const closeHandler = () => {
    chatFindDialogRef.current?.close();
    setChatfind(false);
  };

  const onSubmit: SubmitHandler<messageProps> = (data) => {
    if (data.message.trim()) {
      if (socketRef.current) {
        const message = {
          from: currentUser.email,
          to: user?.email,
          message: data.message,
          time: new Date(),
        } as chatProps;
        socketRef.current.emit('message', JSON.stringify(message));
        flushSync(() => {
          setChats((prev) => [...prev, message]);
        });
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current?.scrollHeight;
        }
      } else {
        toast.error('message not send');
      }
      // socketRef.current?.emit('message', data.message);
      reset();
    } else {
      toast('Please enter a message', { type: 'warning' });
    }
  };
  const setUserHandler = (user: userProps) => {
    setChats([]);
    setUser(user);
  };

  return (
    <>
      <ChatTopBar
        dialogRef={chatFindDialogRef}
        setChatFind={setChatfind}
        setUsers={setUsers}
      />
      <h1 className="text-start text-4xl ml-36 mt-5 mb-5">CHAT</h1>
      <div className="flex h-screen bg-gray-100 ">
        <div className="w-1/4 bg-white shadow-lg p-4 ml-36 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Your Chats</h2>
          <div className="mt-4">
            <p>No chat history available yet.</p>
            {connectedusers.map((user) => (
              <div
                className="flex items-center justify-start mt-4 hover:bg-gray-50 p-2 rounded-lg transition"
                key={user._id}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    user.profileImage?.includes('http')
                      ? user.profileImage
                      : user.profileImage
                      ? `${url}/profile/${user.profileImage}`
                      : '/user.png'
                  }
                  alt={`${user.email}'s profile`}
                />
                <p className="text-sm ml-2 w-3/4">{user.email}</p>
                <button
                  onClick={() => setUserHandler(user)}
                  className="bg-green-500  right-0 p-2 rounded-xl hover:bg-green-600 transition"
                >
                  <img className="h-6 w-6" src="/chat/chat.png" alt="Chat" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-3/4 p-4">
          {user ? (
            <div className="flex flex-col items-center h-full bg-white p-4 shadow-md rounded mb-4">
              <img
                src={
                  user.profileImage?.includes('http')
                    ? user.profileImage
                    : `${url}/profile/${user.profileImage}`
                }
                className="h-16 w-16 rounded-full border-2 border-gray-300"
                alt="Profile"
              />
              <p className="ml-4 text-lg font-semibold">{user.email}</p>
              <div className="flex flex-col w-full">
                {/* Chat Messages */}
                <div
                  style={{ height: '65vh' }}
                  ref={chatContainerRef}
                  className="flex-grow bg-gray-50  border border-gray-300 rounded-lg w-full p-4   overflow-y-auto shadow-inner"
                >
                  <p className="text-gray-500">
                    Chat messages will appear here...
                  </p>
                  {chats.map((chat) => (
                    <div
                    style={chat.from===currentUser.email ? {left:"42vw"} : {}}
                      className={`flex mt-4 w-96 p-4 text-white font-bold text-lg justify-between rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                        chat.from === currentUser.email
                          ? 'bg-gray-600 hover:bg-gray-700 relative '
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      key={v4()}
                    >
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2"></i>
                        <p className="text-sm font-normal">
                          {chat.time.toString()}
                        </p>
                      </div>
                      <p className="max-w-[70%]">{chat.message}</p>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center justify-between fixed bottom-4 left-1/2 transform  bg-white border border-gray-300 rounded-lg shadow-md p-2"
                >
                  <input
                    {...register('message', {
                      required: {
                        value: true,
                        message: 'Please enter a message',
                      },
                      minLength: {
                        value: 1,
                        message: 'Please enter at least one character',
                      },
                    })}
                    className="flex-grow w-72 bg-transparent border-none p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    className="bg-green-500 p-2 rounded-lg ml-2 flex items-center justify-center shadow hover:bg-green-600 transition duration-200"
                  >
                    <img className="h-5 w-5" src="/chat/chat.png" alt="Send" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                No User Selected
              </p>
              <p className="text-gray-500 mb-4">
                To start chatting, please select a user from the list.
              </p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        style={{
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '10px',
        }}
      />
      {chatfind && (
        <ChatFindDialog
          setUser={setUser}
          closeHandler={closeHandler}
          users={users}
          dialogRef={chatFindDialogRef}
        />
      )}
    </>
  );
}
