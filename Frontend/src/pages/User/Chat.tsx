import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { io, Socket } from 'socket.io-client';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';
import ChatTopBar from '../../components/Topbar/ChatTopBar';
import userProps from '../../types/userProps';
import ChatFindDialog from '../../components/Dialog/ChatFindDialog';

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

  useEffect(() => {
    dispatch(setPage('chat'));

    const socket = io(url,
        {
            auth:{
                token:window.localStorage.getItem("token")
            }
        }
    );
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

  return (
    <>
      <ChatTopBar
        dialogRef={chatFindDialogRef}
        setChatFind={setChatfind}
        setUsers={setUsers}
      />
      <h1 className="text-start text-4xl ml-36 mt-5 mb-5">CHAT</h1>
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white shadow-lg p-4 ml-36">
          <h2 className="text-lg font-semibold text-gray-600 ">Your Chats</h2>
          {/* Map through users here to show their names and profile pictures */}
          <div className="mt-4">
            <p>the chat history would be kinda here</p>
          </div>
        </div>
        <div className="w-3/4 p-4">
          {user && (
            <div className="flex items-center bg-white p-4 shadow-md rounded">
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
