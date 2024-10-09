import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import userProps from '../../types/userProps';
import url from '../../helper/backendUrl';
import { ExtendedUser } from '../../pages/User/Chat';

export default function ChatFindDialog({
  dialogRef,
  closeHandler,
  users,
  setUser,
  setConnectedUsers
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  users: Array<userProps>;
  setUser:Dispatch<SetStateAction<ExtendedUser | null>>
  setConnectedUsers:Dispatch<SetStateAction<Array<Pick<userProps,'_id'|'profileImage'|'email'>>>>

}): ReactElement {
    const chatHandler=(user:userProps)=>{
        setUser(user)
        window.localStorage.setItem("chatuser",user.email)

        setConnectedUsers((prev)=>([...prev,user]))
        closeHandler()
    }
  return (
    <dialog
      ref={dialogRef}
      style={{ height: '70vh', width: '70vw' }}
      className="flex flex-col overflow-hidden rounded-xl shadow-lg bg-white border-none p-4"
    >
      <button
        onClick={closeHandler}
        className="self-end text-gray-500 hover:text-red-500 transition-colors mb-2"
      >
        &times; {/* Close icon */}
      </button>
      <h2 className="text-xl font-semibold mb-4">Select a User</h2>
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="m-2 flex items-center justify-between border-b border-gray-300 pb-2"
            >
              <img
                src={
                  user.profileImage?.includes('http')
                    ? user.profileImage
                    : user.profileImage
                    ? `${url}/profile/${user.profileImage}`
                    : '/user.png'
                }
                className="h-12 w-12 rounded-full border-2 border-gray-300 cursor-pointer transition-transform hover:scale-105"
                alt="Profile"
              />
              <div className="flex-1 mx-4">
                <p className="font-medium text-lg">{user.email}</p>
              </div>
              <button onClick={()=>chatHandler(user)}  className="bg-green-500 h-10 w-10 flex items-center justify-center text-white rounded-lg transition-transform hover:scale-105">
                <img className="h-5 w-5" src="/chat/chat.png" alt="Chat" />
              </button>
            </div>
          ))
        )}
      </div>
    </dialog>
  );
}
