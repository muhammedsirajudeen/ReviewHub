import { ReactElement, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { io, Socket } from 'socket.io-client';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';

export default function Chat(): ReactElement {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>();
  useEffect(() => {
    dispatch(setPage('chat'));
    const socket = io(url);
    socket.on('connect', () => {
      toast('connected successfully');
    });
    socket.on('message',(msg)=>{
        console.log(msg)
    })
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  return (
    <>
      <h1 className="ml-36 w-full text-3xl mt-2">CHAT</h1>
      <div className="ml-36 flex flex-col items-center justify-start"></div>
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </>
  );
}
