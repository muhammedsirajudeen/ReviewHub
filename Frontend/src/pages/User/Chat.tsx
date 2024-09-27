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
  const currentUser=useAppSelector((state)=>state.global.user)
  interface messageProps {
    message: string;
  }

  const { register, handleSubmit, reset } = useForm<messageProps>();

  useEffect(() => {
    dispatch(setPage('chat'));

    const socket = io(url, {
      auth: {
        token: window.localStorage.getItem("token"),
      },
    });

    socket.on('connect', socketConnect);
    socket.on('message', (msg) => {
      console.log(msg);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const closeHandler = () => {
    chatFindDialogRef.current?.close();
    setChatfind(false);
  };

  const onSubmit: SubmitHandler<messageProps> = (data) => {
    if (data.message.trim()) {
      if(socketRef.current){
        socketRef.current.emit('message',JSON.stringify({from:currentUser.email,to:user?.email,message:data.message}))
      }else{
        toast.error("message not send")
      }
      // socketRef.current?.emit('message', data.message);
      reset();
    } else {
      toast('Please enter a message', { type: 'warning' });
    }
  };

  return (
    <>
      <ChatTopBar
        dialogRef={chatFindDialogRef}
        setChatFind={setChatfind}
        setUsers={setUsers}
      />
      <h1 className="text-start text-4xl ml-36 mt-5 mb-5">CHAT</h1>
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white shadow-lg p-4 ml-36 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Your Chats</h2>
          <div className="mt-4">
            <p>No chat history available yet.</p>
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
                className="h-14 w-14 rounded-full border-2 border-gray-300"
                alt="Profile"
              />
              <p className="ml-4 text-lg font-semibold">{user.email}</p>
              <div className="flex flex-col w-full">
                {/* Chat Messages */}
                <div className="flex-grow bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto shadow-inner">
                  <p className="text-gray-500">Chat messages will appear here...</p>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center justify-between fixed bottom-10 left-1/2"
                >
                  <input
                    {...register('message', {
                      required: { value: true, message: 'please enter a message' },
                      minLength: {
                        value: 1,
                        message: 'please enter at least one character',
                      },
                    })}
                    className="flex-grow bg-white border border-gray-400 p-2 rounded-lg w-96 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                    placeholder="Type your message..."
                  />
                  <button
                    type="submit"
                    className="bg-green-500 p-2 rounded-lg ml-2 text-white hover:bg-green-600 transition duration-200 "
                  >
                    <img className="h-5 w-5" src="/chat/chat.png" alt="Chat" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white p-4 rounded-lg shadow-md">
              {/* <img
                src="/path/to/illustration.png" // Replace with a suitable image or icon
                alt="Select User"
                className="h-24 w-24 mb-4"
              /> */}
              <p className="text-lg font-semibold text-gray-700 mb-2">
                No User Selected
              </p>
              <p className="text-gray-500 mb-4">
                To start chatting, please select a user from the list.
              </p>
              {/* <button
                onClick={() => {
                  flushSync(()=>{
                    setChatfind(true)
                  })
                  chatFindDialogRef.current?.showModal();
                }} // Assuming setChatfind opens the user selection dialog
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Select User
              </button> */}
            </div>          )}
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
