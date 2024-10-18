import { ReactElement, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAuthenticated, setUser } from '../store/globalSlice';
import { AdminPath } from '../types/pathNames';
export default function AdminSideBar(): ReactElement {
  // const authenticated = useAppSelector((state) => state.global.authenticated);
  const user = useAppSelector((state) => state.global.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.global.page);
  const [expanded, setExpanded] = useState<boolean>(false)
  // const location = useLocation();
  const signoutHandler = () => {
    window.localStorage.clear();
    dispatch(clearAuthenticated());
    dispatch(
      setUser({
        paymentMethod: [],
        favoriteCourses: [],
        walletId: {
          history: [],
          userId: '',
          balance: 0,
          redeemable: 0,
        },
      })
    );
    navigate('/');
  };
  const expandHandler = () => {
    setExpanded(prev => !prev)
  }
  return (
    <>
      <nav className={`h-screen fixed top-0 ${expanded ? "w-52" : "w-28"} flex ${expanded ? "items-start" : "items-center"} flex-col justify-start bg-navbar p-4 transition-all duration-200`}>
        <h1 className="text-xl font-light text-white" onClick={expandHandler}>OLP</h1>

        <div className={`${page === 'dashboard' ? 'bg-blue-400' : ''} flex items-center justify-center review p-6 rounded-lg mt-6`}>
          <a href="/admin/dashboard" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/dashboard.png" />
            {expanded && <span className="ml-2 text-white">Dashboard</span>}
          </a>
        </div>

        <div className={`${page === 'course' ? 'bg-blue-400' : ''} flex items-center justify-center review p-6 rounded-lg mt-6`}>
          <a href="/admin/courses" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/courses.png" />
            {expanded && <span className="ml-2 text-white">Courses</span>}
          </a>
        </div>

        <div className={`${page === 'users' ? 'bg-blue-400' : ''} flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <a href="/admin/users" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/users.png" />
            {expanded && <span className="ml-2 text-white">Users</span>}
          </a>
        </div>

        <div className={`${page === 'chat' ? 'bg-blue-400' : ''} flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <a href="/admin/chat" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/chat.png" />
            {expanded && <span className="ml-2 text-white">Chat</span>}
          </a>
        </div>

        <div className={`${page === 'review' ? 'bg-blue-400' : ''} flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <a href={AdminPath.adminreviewhistory} className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/review.png" />
            {expanded && <span className="ml-2 text-white">Reviews</span>}
          </a>
        </div>

        <div className={`${page === 'payments' ? 'bg-blue-400' : ''} flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <a href="/admin/payments" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/payments.png" />
            {expanded && <span className="ml-2 text-white">Payments</span>}
          </a>
        </div>

        <div className={`${page === 'blog' ? 'bg-blue-400' : ''} flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <a href="/admin/blog" className={`${expanded ? "flex items-center" : "justify-center"}`}>
            <img className='h-6 w-6' src="/sidebar/resource.png" />
            {expanded && <span className="ml-2 text-white">Blog</span>}
          </a>
        </div>

        <div className={`flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <img className="bg-white h-6 w-6 rounded-full" src={user.profileImage ?? '/user.png'} />
        </div>

        <div className={`flex items-center justify-center mt-6 p-6 rounded-lg`}>
          <img onClick={signoutHandler} className="cursor-pointer h-6 w-6" src="/sidebar/logout.png" />
          {expanded && <span className="ml-2 text-white">Logout</span>}
        </div>
      </nav>
      <Outlet />
    </>

  );
}
