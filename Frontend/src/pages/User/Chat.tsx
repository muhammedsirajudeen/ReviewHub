import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { io, Socket } from 'socket.io-client';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';
import ChatTopBar from '../../components/Topbar/ChatTopBar';
import userProps from '../../types/userProps';
import ChatFindDialog from '../../components/Dialog/ChatFindDialog';
// import userProps from '../../types/userProps';
// import { getUsers } from '../../helper/datafetching/userFetching';

const socketConnect = () => {
  toast('connected successfully');
};

export default function Chat(): ReactElement {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>();
  const [users, setUsers] = useState<Array<userProps>>([]);
  const [chatfind, setChatfind] = useState<boolean>(false);
  const chatFindDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // getUsers(setUsers)
    dispatch(setPage('chat'));

    const socket = io(url);
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
      <h1 className="ml-36 w-full text-3xl mt-2">CHAT</h1>
      <div className="ml-26 flex flex-col items-center justify-start"></div>

      <div className="w-1/4 flex items-start justify-center h-screen ml-32 flex-col">
        <h1 className="text-sm text-gray-400">Your Chats</h1>
      </div>
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
      {chatfind && (
        <ChatFindDialog
          closeHandler={closeHandler}
          users={users}
          dialogRef={chatFindDialogRef}
        />
      )}
    </>
  );
}
