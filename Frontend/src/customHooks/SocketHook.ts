import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

type UseSocket = (url: string, onMessage: (message: string) => void,onTyping:(message:string)=>void) => React.MutableRefObject<Socket | null>;
import { io, Socket } from 'socket.io-client';

const socketConnect = () => {
    toast('Connected successfully', { type: 'success' });
  };

const useSocket:UseSocket = (url, onMessage,onTyping) => {
    const socketRef = useRef<Socket | null>(null);
  
    useEffect(() => {
      const socket = io(url, {
        auth: {
          token: window.localStorage.getItem('token'),
        },
      });
  
      socket.on('connect', () => {
        console.log('Socket connected');
        socketConnect()
      });
  
      socket.on('message', (msg) => {
        
        onMessage(msg);
      });
      socket.on('typing',(msg)=>{
        onTyping(msg)
      })
  
      socketRef.current = socket;
  
      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return socketRef;
  };

export default useSocket