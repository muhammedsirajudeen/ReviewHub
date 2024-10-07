import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { FaPhone } from 'react-icons/fa';
import Peer, { MediaConnection } from 'peerjs';
import userProps from '../../types/userProps';
import axiosInstance from '../../helper/axiosInstance';
async function reviewDetailsFetcher(id:string) {
  try {
    const response = (
      await axiosInstance.get(`/user/review/call/${id}`)
    ).data;
    if (response.message === 'success') {
      console.log(response);
      window.localStorage.setItem('callerId', response.call);
      return response.call;
    }
  } catch (error) {
    console.log(error);
    return '';
  }
  return '';
}
export default function VideoChat(): ReactElement {
  const dispatch = useAppDispatch();
  const location = useLocation().state;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useLoaderData() as userProps;
  const streamRef = useRef<MediaStream>();
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer>();
  useEffect(() => {

    dispatch(setPage('review'));
    async function mediaStreamFetcher(): Promise<MediaStream> {
      // Check if the stream is already instantiated
      if (streamRef.current) {
        console.log('Returning existing media stream');
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
        console.error('Error accessing media devices:', error);
        throw error; // Rethrow error for handling in the calling function if needed
      }
    }
    async function requestPermission() {
      const stream = await mediaStreamFetcher();
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
    // reviewDetailsFetcher(location);
    const peer = new Peer(user._id, {
      host: 'localhost',
      port: 3000,
      path: '/peerjs/myapp', // The path you defined in the server
      secure: false,
      // debug: 3,
    });

    peer.on('open', async (id) => {
      console.log('My peer ID is: ' + id);
      peerRef.current=peer
      const callerId = await reviewDetailsFetcher(location);
      const stream = await mediaStreamFetcher();
      if (!stream) {
        console.log('No media stream provided');
      }
      try {
        const call = await peer.call(callerId as string, stream);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
            setLoading(false);
            const videoTracks = remoteStream.getVideoTracks();
    
            console.log(`Received ${videoTracks.length} video tracks.`);
            remoteStream.getTracks().forEach((track)=>{
              console.log(track.label)
            })
          }
        });

        if (!call) {
          console.log('Connection Unsuccessful');
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
    peer.on('call', async (call) => {
      call.answer(await mediaStreamFetcher());
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          setLoading(false);
          const videoTracks = remoteStream.getVideoTracks();
    
          console.log(`Received ${videoTracks.length} video tracks. triggered too`);
          let count=0
          if(videoTracks.length===2){

            remoteStream.getTracks().forEach((track)=>{
              if(count===1){
                if(screenVideoRef.current){
                  screenVideoRef.current.srcObject=new MediaStream([track])
                  screenVideoRef.current.play()
                }
              }
              console.log(track.label)
              count++
            })
          }
          
        }
      });
    });
    //try to handle this gracefully right now just refreshing the page until it succeeds does know that it succeeds at one point
    peer.on('error', (error) => {
      console.log(error.type);
      if (error.type === 'unavailable-id') {
        window.location.reload();
      }
    });
    return () => {
      peer.disconnect();
      peer.destroy(); // Destroy the peer instance
    };
  }, [dispatch, location, user._id]);
  const backHandler = () => {
    navigate('/user/dashboard');
  };

  async function combineMediaStreams(screenStream:MediaStream, webcamStream:MediaStream) {
    // Create a new MediaStream
    const combinedStream = new MediaStream();

    // Add video tracks from both streams
    screenStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
    });
    webcamStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
    });

    // Add audio tracks if needed (optional)
    // screenStream.getAudioTracks().forEach(track => {
    //     combinedStream.addTrack(track);
    // });
    webcamStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
    });

    return combinedStream;
}
  const screenShareHandler = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true, // Only video for screen sharing
    });
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play();
      const combinedStream=await combineMediaStreams(streamRef.current as MediaStream,screenStream)
      const peer=peerRef.current
      if(peer){
        const call=await peer.call(await reviewDetailsFetcher(location),combinedStream)
        if(!call){
          return 
        }
      }
      // const call=peer?.call(await)
      // if(call){
      //   screenStream.getTracks().forEach(track => {
      //     // Add the new track to the peer connection
      //     call.peerConnection.addTrack(track, screenStream);
      //   });
      // }
      
      
    }
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
      <div className="flex items-center w-full justify-center mt-10 ">
        <div className="w-1/2  flex items-center justify-end">
          <video ref={localVideoRef} className="w-3/4 h-3/4 rounded-xl ">
            {' '}
          </video>
        </div>
        <div className="w-1/2 ml-20 flex items-center justify-start ">
          <video
            controls
            ref={remoteVideoRef}
            className="w-3/4 h-3/4 bg-black rounded-xl"
          ></video>
        </div>
      </div>
      <div className="flex items-center min-w-full justify-center">
        <div className="w-1/2 mt-20 flex items-center justify-center ">
          <video
            controls
            ref={screenVideoRef}
            className="w-1/2 h-1/2 bg-black rounded-xl"
          ></video>
        </div>
      </div>
      <div className="absolute flex p-2 rounded-lg h-12 bg-black items-center justify-center bottom-10 left-1/2">
        <button className=" rounded-lg p-2 items-center justify-center  bg-red-600 flex ">
          <FaPhone onClick={() => backHandler()} color="white" />
        </button>
        {
          user.authorization!=='reviewer' && 

        <button onClick={() => screenShareHandler()}>
          <img className="h-10 w-10" src="/videochat/screenshare.png" />
        </button>
        }
      </div>
    </>
  );
}
