import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
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
import useSocket from '../../customHooks/SocketHook';



interface messageCount{
  userId:string,
  messageCount:number
}
interface messageProps {
  message: string;
}

export default function Chat(): ReactElement {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<Array<userProps>>([]);
  const [chatfind, setChatfind] = useState<boolean>(false);
  const chatFindDialogRef = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState<userProps | null>(null);
  const [chats, setChats] = useState<Array<chatProps>>([]);
  const currentUser = useAppSelector((state) => state.global.user);
  const [connectedusers, setConnectedusers] = useState<Array<userProps>>([]);
  const [chatcount,setChatcount]=useState<Array<messageCount>>([])
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm<messageProps>();
  const onMessage=(msg:string)=>{
    
    const message = JSON.parse(msg);
    //already connected user
    flushSync(() => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          // Check if the message belongs to the current chat
          if (chat.userId === message.from) {
            // Instead of pushing to the existing messages array (mutating it),
            // return a new chat object with an updated messages array
            return {
              ...chat,
              messages: [...chat.messages, message], // Immutably add the new message
            };
          }
          return chat;
        });
    
        return updatedChats;
      });
      
      const currentChat=window.localStorage.getItem("chatuser")
      setChatcount((prevChatcount) => {
        let flag = false;
        const updatedChatcount = prevChatcount.map((chat) => {
          //temporary hack fix it
          console.log("this is",currentChat,message.from)
          if (chat.userId === message.from) {
            flag = true;
            if(currentChat===message.from){
              return { ...chat, messageCount: 0};

            }
            return { ...chat, messageCount: chat.messageCount + 1 };
          }
          return chat; 
        });
        if (!flag ) {
          return [...updatedChatcount, { userId: message.from, messageCount: 1 }];
        }
      
        return updatedChatcount;
      });
    });
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current?.scrollHeight;
    }
  }
  const socketRef=useSocket(url,onMessage)


  useEffect(() => {
    window.localStorage.removeItem('chatuser')
    dispatch(setPage('chat'));
    getConnectedUser(setConnectedusers)
  }, [dispatch]);
  
  useEffect(() => {
    setChats([]);
    historyFetching(user?._id as string,user?.email as string ,setChats, chatContainerRef);
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
        };
        
        socketRef.current.emit('message', JSON.stringify(message));
        flushSync(() => {
          if(chats.length===0){
            setChats((prev)=>{
              return(
                [...prev,{userId:user?.email as string,messages:[message]}]
              )
            })
            return
          }
          const copyChats=[...chats]
          copyChats.forEach((chat)=>{
            if(chat.userId===user?.email){
              chat.messages.push(message)
            }
          })
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
  const setUserHandler = (user: userProps) => {
    
    flushSync(()=>{
      setUser(user);
    })
    window.localStorage.setItem("chatuser",user.email)
    const copymessage=chatcount
    copymessage.forEach((chat)=>{
      if(user.email===chat.userId){
        chat.messageCount=0
      }
    })
    setChatcount(copymessage)
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
                {
                  chatcount.map((count)=>{
                    if(count.userId===connecteduser.email && connecteduser.email!==user?.email && count.messageCount>0  ){
                      return(
                        <p className='w-10 text-xs p-2 rounded-xl bg-blue-500 mr-4 text-white text-center align-middle ' >{count.messageCount}</p>
                      )
                    }
                 })
                }
                <button
                  onClick={() => setUserHandler(connecteduser)}
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
                    if(chat.userId===user?.email){
                      return chat.messages.map((indi)=>{
                        
                        return(
                          <div
                          style={indi.from===currentUser.email ? {left:"30vw"} : {}}
                          className={`flex mt-4 w-96 p-4 text-white font-bold text-lg justify-between rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                            indi.from === currentUser.email
                            ? 'bg-gray-600 hover:bg-gray-700 relative '
                            : 'bg-green-600 hover:bg-green-700'
                          }`}
                          key={v4()}
                        >
                          <div className="flex items-center">
                            <i className="fas fa-clock mr-2"></i>
                            <p className="text-sm font-normal">
                              {indi.time.toString()}
                            </p>
                          </div>
                          <p className="max-w-[70%]">{indi.message}</p>
                        </div>
                        )
                      })                  
                    }
                  }  
                )}
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
        setConnectedUsers={setConnectedusers}
        />
      )}
    </>
  );
}
