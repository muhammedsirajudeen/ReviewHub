import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { FaPhone } from 'react-icons/fa';
import Peer from 'peerjs';
import userProps from '../../types/userProps';
import axiosInstance from '../../helper/axiosInstance';

export default function VideoChat(): ReactElement {
  const dispatch = useAppDispatch();
  const location = useLocation().state;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useLoaderData() as userProps;
  const streamRef = useRef<MediaStream>();
  const remoteVideoRef=useRef<HTMLVideoElement>(null)
  useEffect(() => {
    let mediaStream:MediaStream
    async function reviewDetailsFetcher() {
      try {
        const response = (
          await axiosInstance.get(`/user/review/call/${location}`)
        ).data;
        if (response.message === 'success') {
          console.log(response);
          window.sessionStorage.setItem('callerId', response.call);
        }
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(setPage('review'));
    async function mediaStreamFetcher(): Promise<MediaStream> {
        // Check if the stream is already instantiated
        if (streamRef.current) {
            console.log("Returning existing media stream");
            return streamRef.current; // Return existing stream
        }
        
        try {
            // If the stream is not instantiated, get a new one
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            streamRef.current = stream; // Store the new stream in ref
            return stream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            throw error; // Rethrow error for handling in the calling function if needed
        }
    }
    async function requestPermission() {
      const stream = await mediaStreamFetcher()
      if (localVideoRef.current) {
        try {
          localVideoRef.current.srcObject = stream;
        } catch (error) {
          console.log(error);
        }
        streamRef.current = stream;
        localVideoRef.current.play();
      }
    }
    requestPermission();
    reviewDetailsFetcher();
    const peer = new Peer(user._id, {
      host: 'localhost',
      port: 3000,
      path: '/peerjs/myapp', // The path you defined in the server
      secure: false,
      debug:3
    });

    peer.on('open', async (id) => {
      console.log('My peer ID is: ' + id);
      const callerId = window.sessionStorage.getItem('callerId');
      const stream=await mediaStreamFetcher()
      if(!stream){
        console.log("No media stream provided")
      }
      try {
        const call = await peer.call(
          callerId as string,
          stream
        );
        call.on('stream',(remoteStream)=>{
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
                setLoading(false)
              }
        })
        
        if (!call) {
          console.log('Connection Unsuccessful')
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
    peer.on('call', async (call) => {
      call.answer(await mediaStreamFetcher())
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          setLoading(false)
        }
      });

    });
    return () => {
      peer.disconnect();
      peer.destroy();    // Destroy the peer instance

    };
  }, [dispatch, location, user._id]);
  const backHandler = () => {
    navigate('/user/dashboard');
  };
  return (
    <>
      {loading && (
        <div className="flex absolute items-center justify-center h-screen w-screen flex-col">
          <ClipLoader size={100} color="red" loading={loading} />
          <p className=" text-gray-400 mt-10 font-bold text-xl">
            waiting for the user to connect
          </p>
        </div>
      )}
      <h1 className="text-3xl ml-36">VIDEO CHAT</h1>
      <div className="flex items-center w-full justify-center mt-10">
        <div className="w-1/2  flex items-center justify-end">
          <video ref={localVideoRef} className="w-3/4 h-3/4 rounded-xl ">
            {' '}
          </video>
        </div>
        <div className="w-1/2 ml-20 flex items-center justify-start ">
          <video ref={remoteVideoRef} className="w-3/4 h-3/4 bg-black rounded-xl"></video>
        </div>
      </div>
      <button className="absolute rounded-lg p-2 items-center justify-center bottom-10 left-1/2 bg-red-600 flex ">
        <FaPhone color="white" />
        <p onClick={() => backHandler()} className="text-white ml-2">
          End Call
        </p>
      </button>
    </>
  );
}
