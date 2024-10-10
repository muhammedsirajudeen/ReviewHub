import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';
import ChatTopBar from '../../components/Topbar/ChatTopBar';
import userProps from '../../types/userProps';
import ChatFindDialog from '../../components/Dialog/ChatFindDialog';
import { SubmitHandler, useForm } from 'react-hook-form';
import { chatmessageProps, chatProps } from '../../types/chatProps';
import { v4 } from 'uuid';
import getConnectedUser from '../../helper/datafetching/connectedUser';
import { historyFetching } from '../../helper/datafetching/historyFetching';
import { flushSync } from 'react-dom';
import useSocket from '../../customHooks/SocketHook';
import axiosInstance from '../../helper/axiosInstance';
import messagecountFetching from '../../helper/datafetching/messagecountFetching';
import { format } from 'date-fns';
import { produce } from 'immer';
import { FaTrash } from 'react-icons/fa';

export interface messageCount {
  //
  userId: string;
  messageCount: number;
}
interface messageProps {
  message: string;
}

export interface ExtendedUser
  extends Pick<userProps, 'email' | 'profileImage' | 'lastSeen'> {
  _id: string;
  online?: boolean;
}

export default function Chat(): ReactElement {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<Array<userProps>>([]);
  const [chatfind, setChatfind] = useState<boolean>(false);
  const chatFindDialogRef = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [chats, setChats] = useState<Array<chatProps>>([]);
  const currentUser = useAppSelector((state) => state.global.user);
  const [connectedusers, setConnectedusers] = useState<Array<ExtendedUser>>([]);
  const [chatcount, setChatcount] = useState<Array<messageCount>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, watch } = useForm<messageProps>();
  const onlineDataRef = useRef<Record<string, boolean>>({});
  const [chatmodal, setChatmodal] = useState<boolean>();
  const [chatposition, setChatposition] = useState({ ClientX: 0, ClientY: 0 });
  const [chat, setChat] = useState<chatmessageProps>();
  const [typing, setTyping] = useState<boolean>(false);
  const [reply, setReply] = useState<chatmessageProps>();
  const onMessage = async (msg: string) => {
    setTyping(false);
    const message = JSON.parse(msg);
    const fromUser = (
      await axiosInstance.get(`/user/chat/users?email=${message.from}`)
    ).data.user;

    flushSync(() => {
      //if the user isnt connected yet we have to add them here so lets handle it here an api call might be required
      setConnectedusers((connected) => {
        console.log(connected);
        let flag = false;
        connected.forEach((connected) => {
          if (connected.email === message.from) {
            flag = true;
          }
        });
        if (!flag) {
          // console.log("new user")
          if (fromUser) {
            console.log('new user is', fromUser);
            toast('you have a message from', message.from);
            return [
              ...connected,
              {
                _id: fromUser._id,
                profileImage: fromUser.profileImage,
                email: fromUser.email,
                online: true,
              },
            ];
          }
          //perform api call and fetch the user forst

          // return [...connected,{}]
        }
        return connected;
      });
      //pushing latest chat to the top
      setConnectedusers(
        produce((draft) => {
          let index = -1;
          for (let i = 0; i < draft.length; i++) {
            if (draft[i].email === fromUser.email) {
              index = i;
            }
          }
          const copy = draft[index];
          draft.splice(index, 1);
          draft.splice(0, 0, copy);
        })
      );

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          // Check if the message belongs to the current chat then pushing it
          if (chat.userId === message.from) {
            // Instead of pushing to the existing messages array (mutating it),
            return {
              ...chat,
              messages: [...chat.messages, message], // Immutably add the new message
            };
          }
          return chat;
        });

        return updatedChats;
      });

      const currentChat = window.localStorage.getItem('chatuser');
      setChatcount((prevChatcount) => {
        let flag = false;
        const updatedChatcount = prevChatcount.map((chat) => {
          //temporary hack fix it
          if (chat.userId === message.from) {
            flag = true;
            if (currentChat === message.from) {
              return { ...chat, messageCount: 0 };
            }
            return { ...chat, messageCount: chat.messageCount + 1 };
          }
          return chat;
        });
        if (!flag) {
          return [
            ...updatedChatcount,
            { userId: message.from, messageCount: 1 },
          ];
        }

        return updatedChatcount;
      });
    });
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current?.scrollHeight;
    }
  };

  const onTyping = (msg: string) => {
    const message = JSON.parse(msg);
    console.log(message);
    if (message.from === user?.email) {
      setTyping(true);
      //potentially hiding the issue for now make it smoother if u get enough time

      const timerId = setTimeout(() => setTyping(false), 2000);
      console.log(timerId);
    }
  };
  const socketRef = useSocket(url, onMessage, onTyping);

  useEffect(() => {
    window.localStorage.removeItem('chatuser');
    dispatch(setPage('chat'));
    getConnectedUser(setConnectedusers, onlineDataRef);
    //get count of chat here
    messagecountFetching(setChatcount);
  }, [dispatch]);

  useEffect(() => {
    setChats([]);
    historyFetching(
      user?._id as string,
      user?.email as string,
      setChats,
      chatContainerRef
    );
  }, [user]);
  useEffect(() => {
    if (watch('message')) {
      if (watch('message').length > 0) {
        const typingstatus = {
          from: currentUser.email,
          to: user?.email,
          typing: true,
        };
        socketRef.current?.emit('typing', JSON.stringify(typingstatus));
      }
    }
  }, [currentUser.email, socketRef, user?.email, watch]);
  const closeHandler = () => {
    chatFindDialogRef.current?.close();
    setChatfind(false);
  };

  const onSubmit: SubmitHandler<messageProps> = (data) => {
    setReply(undefined);
    if (data.message.trim()) {
      if (socketRef.current) {
        const message = {
          from: currentUser.email,
          to: user?.email,
          message: data.message,
          time: new Date().toISOString(),
          uuid: v4(),
        } as chatmessageProps;
        //this is just a base
        if (reply) {
          message.repliedto = reply.message;
        }

        socketRef.current.emit('message', JSON.stringify(message));
        flushSync(() => {
          if (chats.length === 0) {
            setChats((prev) => {
              return [
                ...prev,
                { userId: user?.email as string, messages: [message] },
              ];
            });
            return;
          }
          const copyChats = [...chats];
          copyChats.forEach((chat) => {
            if (chat.userId === user?.email) {
              chat.messages.push(message);
            }
          });
          setChats(copyChats);
        });
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current?.scrollHeight;
        }
      } else {
        toast.error('message not send');
      }
      reset();
    } else {
      toast('Please enter a message', { type: 'warning' });
    }
  };
  const setUserHandler = async (user: ExtendedUser) => {
    const response = (
      await axiosInstance.post('/user/chat/clear', {
        messageUserId: currentUser._id,
        userId: user._id,
      })
    ).data;
    if (response.message === 'success') {
      console.log(response);
    }
    flushSync(() => {
      setUser(user);
    });
    window.localStorage.setItem('chatuser', user.email);
    const copymessage = chatcount;
    copymessage.forEach((chat) => {
      if (user.email === chat.userId) {
        chat.messageCount = 0;
      }
    });
    setChatcount(copymessage);
  };
  const chatPopupHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    chat: chatmessageProps
  ) => {
    console.log(e.clientX);
    console.log(e.clientY);
    //beauty of immer worth the 17KB's deps
    setChatposition(
      produce((draft) => {
        draft.ClientX = e.clientX;
        draft.ClientY = e.clientY;
      })
    );
    console.log(chat);
    setChatmodal(true);
    setChat(chat);
  };
  const chatdeleteHandler = async () => {
    try {
      const response = (
        await axiosInstance.patch('/user/chat', {
          userId: currentUser._id,
          alternateUserId: user?._id,
          uuid: chat?.uuid,
        })
      ).data;
      if (response.message === 'success') {
        toast.success('Deleted Successfully');
        setChats(
          produce((draft) => {
            let indexChat = 0;
            const messages = draft[0].messages;
            messages.map((message, index) => {
              if (message.uuid === chat?.uuid) {
                indexChat = index;
              }
            });
            messages.splice(indexChat, 1);
            setChatmodal(false);
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    }
  };
  const replyHandler = () => {
    setChatmodal(false);
    setReply(chat);
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
            {connectedusers.map((connecteduser) => (
              <div
                className="flex items-center justify-start mt-4 hover:bg-gray-50 p-2 rounded-lg transition"
                key={connecteduser._id}
              >
                <div
                  className={`h-2 w-2 mr-4 rounded-full ${
                    connecteduser.online ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    connecteduser.profileImage?.includes('http')
                      ? connecteduser.profileImage
                      : connecteduser.profileImage
                      ? `${url}/profile/${connecteduser.profileImage}`
                      : '/user.png'
                  }
                  alt={`${connecteduser.email}'s profile`}
                />
                <p className="text-sm ml-2 w-3/4">{connecteduser.email}</p>
                {chatcount.map((count, index) => {
                  if (
                    count.userId === connecteduser.email &&
                    connecteduser.email !== user?.email &&
                    count.messageCount > 0
                  ) {
                    return (
                      <p
                        key={index}
                        className="w-10 text-xs p-2 rounded-xl bg-blue-500 mr-4 text-white text-center align-middle "
                      >
                        {count.messageCount}
                      </p>
                    );
                  }
                })}
                <button
                  onClick={() => setUserHandler(connecteduser as ExtendedUser)}
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
              {onlineDataRef.current[user.email] ? (
                <div className="flex items-center mb-2 justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <p className="text-xs">online</p>
                </div>
              ) : (
                <div>
                  Last seen{' '}
                  {format(
                    user.lastSeen ? new Date(user.lastSeen) : new Date(),
                    'PPpp'
                  )}
                </div>
              )}
              <div className="flex flex-col w-full ">
                {/* Chat Messages */}
                <div
                  style={{ height: '65vh' }}
                  ref={chatContainerRef}
                  className="flex-grow bg-gray-50  overflow-x-hidden border border-gray-300 rounded-lg w-full p-4   overflow-y-auto shadow-inner"
                >
                  <p className="text-gray-500">
                    Chat messages will appear here...
                  </p>
                  {chats.map((chat) => {
                    if (chat.userId === user?.email) {
                      return chat.messages.map((indi, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex items-start space-x-4 mb-4 ${
                              indi.from === currentUser.email
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            {
                              indi.repliedto && 
                              (
                              <div className="bg-gray-100 p-3 rounded-lg shadow-md border border-gray-200 max-w-full">
                                <p className="text-sm text-gray-600 font-medium">
                                  <span className="font-semibold text-gray-800">
                                    Replied to:
                                  </span>{' '}
                                  {indi.repliedto}
                                </p>
                              </div>

                              )
                            }
                            

                            {indi.from !== currentUser.email && (
                              <div className="flex-shrink-0">
                                {/* <img
                  src="/path-to-avatar.jpg" // Use real user image or initials
                  alt="User avatar"
                  className="h-10 w-10 rounded-full"
                /> */}
                              </div>
                            )}

                            <div
                              className={`max-w-lg p-4 text-white font-bold text-lg rounded-2xl shadow-md ${
                                indi.from === currentUser.email
                                  ? 'bg-blue-500 text-right' // User's message bubble
                                  : 'bg-green-500 text-left' // Other's message bubble
                              }`}
                              style={
                                indi.from === currentUser.email
                                  ? { marginRight: '30px' }
                                  : {}
                              }
                            >
                              <div className="text-sm font-normal mb-1 text-gray-300">
                                <button
                                  onClick={(e) => {
                                    chatPopupHandler(e, indi);
                                  }}
                                >
                                  <img
                                    className="h-3 w-3"
                                    src="/chat/down.png"
                                  />
                                </button>{' '}
                                {indi.time.toString()}
                              </div>
                              <p className="break-words">{indi.message}</p>
                            </div>

                            {indi.from === currentUser.email && (
                              <div className="flex-shrink-0">
                                {/* <img
                  src="/path-to-current-user-avatar.jpg"
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full"
                /> */}
                              </div>
                            )}
                          </div>
                        );
                      });
                    }
                  })}
                </div>
                {typing && (
                  <div className="flex items-center space-x-2">
                    <div className="typing-dot bg-gray-500 w-2.5 h-2.5 rounded-full animate-bounce"></div>
                    <div className="typing-dot bg-gray-500 w-2.5 h-2.5 rounded-full animate-bounce delay-75"></div>
                    <div className="typing-dot bg-gray-500 w-2.5 h-2.5 rounded-full animate-bounce delay-150"></div>
                    <p className="text-gray-600 text-sm font-medium animate-pulse">
                      Typing...
                    </p>
                  </div>
                )}

                {reply && (
                  <div className="flex items-center  relative bottom-28 w-full justify-center">
                    <div className="relative w-96 bg-gray-200 shadow-lg rounded-lg p-4">
                      <button
                        onClick={() => setReply(undefined)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none transition duration-300"
                      >
                        &times;
                      </button>
                      <p className="text-center text-gray-700 font-medium w-full bg-gray-100 h-12 flex items-center justify-center rounded-lg mt-2 px-4">
                        {reply.message}
                      </p>
                    </div>
                  </div>
                )}

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
          setConnectedUsers={setConnectedusers}
        />
      )}
      {chatmodal && (
        <div
          style={{
            position: 'absolute',
            top: chatposition.ClientY,
            left: chatposition.ClientX,
            transform: 'translate(-50%, -50%)', // Center the modal based on click position
            width: '250px',
            padding: '20px', // Add padding for spacing
            backgroundColor: '#fff', // White background for clarity
            color: '#333', // Darker text color for better readability
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
            borderRadius: '12px', // Rounded corners for a modern look
            zIndex: 1000, // Ensure it's on top
            transition: 'all 0.3s ease-in-out', // Smooth opening effect
          }}
          className="flex flex-col shadow-lg border border-gray-300 items-center justify-start"
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => setChatmodal(false)}
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          >
            ✕
          </button>

          {/* Modal Header */}

          <div>
            <h2 className="text-lg font-semibold mb-4"></h2>
            {/* Modal Body */}
            {chat?.to === currentUser.email && (
              <button
                onClick={() => replyHandler()}
                className="bg-green-500 text-xs text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300"
              >
                Reply
              </button>
            )}
            {chat?.from === currentUser.email && (
              <button
                onClick={() => chatdeleteHandler()}
                className={`flex  items-center justify-center w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300`}
              >
                <FaTrash className="mr-2" />
                <p className="text-xs">Delete for Both Users</p>
              </button>
            )}
            {/* Action Button */}
          </div>
        </div>
      )}
    </>
  );
}
