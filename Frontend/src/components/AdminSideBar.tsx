import { ReactElement } from 'react';
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
  return (
    <>
      <nav className="h-screen fixed top-0 w-28 flex items-center flex-col justify-start bg-navbar p-4">
        <h1 className="text-xl font-light text-white">OLP</h1>
        <div
          className={` ${
            page === 'dashboard' ? 'bg-blue-400' : ''
          } flex items-center justify-centerreview p-6 rounded-lg mt-10`}
        >
          <a href="/admin/dashboard">
            <img src="/sidebar/dashboard.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'course' ? 'bg-blue-400' : ''
          } flex items-center justify-centerreview p-6 rounded-lg mt-10`}
        >
          <a href="/admin/courses">
            <img src="/sidebar/courses.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'users' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a href="/admin/users">
            <img src="/sidebar/users.png" />
          </a>
        </div>
        {/* chat interface is the same for all the users */}
        <div
          className={`${
            page === 'chat' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          {' '}
          <a href="/admin/chat">
            <img src="/sidebar/chat.png" />
          </a>
        </div>

        <div
          className={`${
            page === 'review' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a href={AdminPath.adminreviewhistory}>
            <img src="/sidebar/review.png" />
          </a>
        </div>

        <div
          className={`${
            page === 'payments' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a href="/admin/payments">
            <img src="/sidebar/payments.png" />
          </a>
        </div>
        {/* this interface is also basically same */}
        <div
          className={`${
            page === 'blog' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a href="/admin/blog">
            <img src="/sidebar/resource.png" />
          </a>
        </div>
        <img
          onClick={signoutHandler}
          className="mt-10  cursor-pointer"
          src="/sidebar/logout.png"
        />
        <img
          className="bg-white h-8 w-8 mb-8 rounded-full mt-10"
          src={user.profileImage ?? '/user.png'}
        />
      </nav>
      <Outlet />
    </>
  );
}
