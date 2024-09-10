import { ReactElement } from "react";
import { Outlet,  useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthenticated, setUser } from "../store/globalSlice";
export default function AdminSideBar(): ReactElement {
  // const authenticated = useAppSelector((state) => state.global.authenticated);
  const user = useAppSelector((state) => state.global.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page=useAppSelector((state)=>state.global.page)
  // const location = useLocation();
  const signoutHandler = () => {
    window.localStorage.clear();
    dispatch(clearAuthenticated());
    dispatch(setUser({}));
    navigate("/");
  };
  return (
    <>
      <nav className="h-screen absolute top-0 w-28 flex items-center flex-col justify-start bg-navbar p-4">
        <h1 className="text-xl font-light text-white">OLP</h1>
        <div className={` ${page==="dashboard"?"bg-blue-400":""} flex items-center justify-centerreview p-6 rounded-lg mt-10`}>
          <a href="/user/dashboard">
            <img  src="/sidebar/dashboard.png"/>   
          </a>
        </div>
        <div className="flex items-center justify-center mt-28">
          <a href="/admin/courses">
            <img  src="/sidebar/courses.png"/>   
          </a>
        </div>
        <div className="flex items-center justify-center mt-14">
          <a href="/admin/users">
            <img  src="/sidebar/users.png"/>   
          </a>
        </div>
        {/* chat interface is the same for all the users */}
        <div className="flex items-center justify-center mt-14">
        <a href="/user/chat">
            <img  src="/sidebar/chat.png"/>   
          </a>
        </div>

        <div className="flex items-center justify-center mt-14">
        <a href="/admin/review">
            <img  src="/sidebar/review.png"/>   
          </a>
        </div>

        <div className="flex items-center justify-center mt-14">
        <a href="/admin/payments">
            <img  src="/sidebar/payments.png"/>   
          </a>
        </div>
        {/* this interface is also basically same */}
        <div className="flex items-center justify-center mt-14">
        <a href="/user/resources">
            <img  src="/sidebar/resource.png"/>   
          </a>
        </div>
        <img onClick={signoutHandler} className="mt-40 cursor-pointer" src="/sidebar/logout.png"/>
        <img className="bg-white h-8 w-8 rounded-full mt-10" src={user.profileImage ?? "/user.png"}/>

      </nav>  
      <Outlet />
    </>
  );
}
