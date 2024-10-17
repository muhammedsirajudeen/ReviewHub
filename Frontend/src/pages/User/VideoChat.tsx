import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { FaPhone } from 'react-icons/fa';
import Peer, { DataConnection } from 'peerjs';
import userProps from '../../types/userProps';
import axiosInstance from '../../helper/axiosInstance';
import { toast } from 'react-toastify';
import { produce } from 'immer';
import { flushSync } from 'react-dom';
import recordingHelper from '../../helper/recordingHelper';
async function reviewDetailsFetcher(id: string) {
  try {
    const response = (await axiosInstance.get(`/user/review/call/${id}`)).data;
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

interface messageProps {
  origin: string;
  message: string;
}

export default function VideoChat(): ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [chat, setChat] = useState<boolean>(false);
  const [nudge, setNudge] = useState<boolean>(false);
  const [screenshare,setScreenshare]=useState<boolean>(false)
  const dispatch = useAppDispatch();
  const location = useLocation().state;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const user = useLoaderData() as userProps;
  const streamRef = useRef<MediaStream>();
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const peerRef = useRef<Peer>();
  const [messages, setMessages] = useState<messageProps[]>([]);
  const connectionRef = useRef<DataConnection>();
  const chatContainer = useRef<HTMLDivElement>(null);
  const renderCount = useRef<number>(0);
  
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
      host: import.meta.env.VITE_WEBSOCKET,
      port: import.meta.env.VITE_WEBSOCKET==='localhost' ? 3000 : 443,
      path: '/peerjs/myapp', // The path you defined in the server
      secure: import.meta.env.VITE_WEBSOCKET==='localhost' ? false : true ,
      // debug: 3,
    });
    peer.on('connection', (conn) => {
      connectionRef.current = conn;
      //part of chat as well
      conn.on('data', (data) => {
        console.log(data);
        setNudge(true);
        flushSync(() => {
          setMessages(
            produce((draft) => {
              draft.push({ origin: 'remote', message: data as string });
            })
          );
        });
        if (chatContainer.current) {
          chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        }
      });
    });
    peer.on('open', async (id) => {
      console.log('My peer ID is: ' + id);
      peerRef.current = peer;
      const callerId = await reviewDetailsFetcher(location);
      const stream = await mediaStreamFetcher();
      if (!stream) {
        console.log('No media stream provided');
      }
      try {
        const call = await peer.call(callerId as string, stream);
        const connection = await peer.connect(callerId);
        connectionRef.current = connection;
        //this  is  the part of chat
        connection.on('data', (data) => {
          console.log(data);
          setNudge(true);
          flushSync(() => {
            setMessages(
              produce((draft) => {
                draft.push({ origin: 'remote', message: data as string });
              })
            );
          });
          if (chatContainer.current) {
            chatContainer.current.scrollTop =
              chatContainer.current.scrollHeight;
          }
        });
        call.on('stream', async (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
            if (renderCount.current === 0) {
              recordingHelper(
                await mediaStreamFetcher(),
                location,
                user.authorization
              );
              renderCount.current++;
            }

            setLoading(false);
            const videoTracks = remoteStream.getVideoTracks();

            console.log(`Received ${videoTracks.length} video tracks.`);
            let count = 0;
            if (videoTracks.length === 2) {
              remoteStream.getTracks().forEach((track) => {
                if (count === 1) {
                  flushSync(()=>{
                    setScreenshare(true)
                  })
                  console.log(screenshare)
                  if (screenVideoRef.current) {
                    screenVideoRef.current.srcObject = new MediaStream([track]);
                    screenVideoRef.current.play();

                  }
                }
                console.log(track.label);
                count++;
              });
            }
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
      call.on('stream', async (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          if (renderCount.current === 0) {
            recordingHelper(
              await mediaStreamFetcher(),
              location,
              user.authorization
            );
            renderCount.current++;
          }

          setLoading(false);
          const videoTracks = remoteStream.getVideoTracks();

          console.log(
            `Received ${videoTracks.length} video tracks. triggered too`
          );
          let count = 0;
          if (videoTracks.length === 2) {
            remoteStream.getTracks().forEach((track) => {
              if (count === 1) {
                flushSync(()=>{
                  setScreenshare(true)
                })
                if (screenVideoRef.current) {
                  screenVideoRef.current.srcObject = new MediaStream([track]);
                  screenVideoRef.current.play();
                }
              }
              console.log(track.label);
              count++;
            });
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
  }, [dispatch, location, user._id, user.authorization]);

  async function combineMediaStreams(
    screenStream: MediaStream,
    webcamStream: MediaStream
  ) {
    // Create a new MediaStream
    const combinedStream = new MediaStream();

    // Add video tracks from both streams
    screenStream.getVideoTracks().forEach((track) => {
      combinedStream.addTrack(track);
    });
    webcamStream.getVideoTracks().forEach((track) => {
      combinedStream.addTrack(track);
    });

    // Add audio tracks if needed (optional)
    // screenStream.getAudioTracks().forEach(track => {
    //     combinedStream.addTrack(track);
    // });
    webcamStream.getAudioTracks().forEach((track) => {
      combinedStream.addTrack(track);
    });

    return combinedStream;
  }
  const screenShareHandler = async () => {
    flushSync((()=>{
      setScreenshare(true)
    }))
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true, // Only video for screen sharing
    });
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play();
      const combinedStream = await combineMediaStreams(
        streamRef.current as MediaStream,
        screenStream
      );
      const peer = peerRef.current;
      if (peer) {
        const call = await peer.call(
          await reviewDetailsFetcher(location),
          combinedStream
        );
        if (!call) {
          return;
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
  const chatHandler = () => {
    setChat((prev) => !prev);
    setNudge(false);
  };
  const messageSendHandler = () => {
    if (!messageInputRef.current) {
      return;
    }
    const message = messageInputRef.current.value;
    if (message.trim() === '') {
      toast.error('message should not be empty');
    } else if (message.length < 2) {
      toast.error('Message should be atleast 1 character in length');
    } else {
      if (connectionRef.current) {
        connectionRef.current.send(message);
      }
      flushSync(() => {
        setMessages(
          produce((draft) => {
            draft.push({ origin: 'local', message: message });
          })
        );
      });
      if (chatContainer.current) {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
      }
      messageInputRef.current.value = '';
    }
  };
  const backHandler = async () => {
    if (user.authorization === 'reviewer') {
      try {
        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
        const response = (
          await axiosInstance.put('/reviewer/reviewcompletion', {
            reviewId: location,
          })
        ).data;
        if (response.message === 'success') {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
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
      <div className="flex items-center w-full justify-center mt-10 ">
        <div className="w-1/2  flex items-center justify-center">
          <video ref={localVideoRef} className="w-1/2 h-1/2 rounded-xl ">
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
      {
        screenshare && 
        (
        <div className="flex items-center min-w-full justify-center mt-20 -z-1">
          <div className="w-1/2 mt-10 flex items-center justify-center ">
            <video
              controls
              ref={screenVideoRef}
              className="w-1/2 h-1/2 bg-black rounded-xl"
            ></video>
          </div>
        </div>
        )
      }
      <div className="absolute flex p-2 rounded-lg h-12 bg-black items-center justify-center bottom-10 left-1/2 z-20">
        <button className=" rounded-lg p-2 items-center justify-center  bg-red-600 flex ">
          <FaPhone onClick={() => backHandler()} color="white" />
        </button>
        {user.authorization !== 'reviewer' && (
          <button
            className="flex items-center justify-center ml-10"
            onClick={() => screenShareHandler()}
          >
            <img className="h-6 w-6" src="/videochat/screenshare.png" />
          </button>
        )}
        {nudge && (
          <div className="h-4 w-4 bg-green-600 rounded-full relative left-14 bottom-3" />
        )}
        <button
          onClick={() => chatHandler()}
          className="flex ml-10 items-center justify-center"
        >
          <img className="h-6 w-6" src="/videochat/chat.png" />
        </button>
      </div>
      {chat && (
        <div className="fixed h-96 w-full max-w-sm border border-gray-300 bg-white right-10 bottom-10 shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h2 className="text-lg font-medium">Chat</h2>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={chatHandler}
            >
              ✕
            </button>
          </div>

          <div
            ref={chatContainer}
            className="flex-1  overflow-y-auto p-3 space-y-2"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.origin === 'remote' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`p-3 max-w-xs lg:max-w-md rounded-lg shadow-lg ${
                    message.origin === 'remote'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="text-xs text-gray-300 mb-1">
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm break-words">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center">
            <input
              type="text"
              ref={messageInputRef}
              placeholder="Enter a message"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={messageSendHandler}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
