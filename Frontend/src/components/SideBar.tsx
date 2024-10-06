import { ReactElement } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAuthenticated, setUser } from '../store/globalSlice';
import url from '../helper/backendUrl';
export default function SideBar(): ReactElement {
  // const authenticated = useAppSelector((state) => state.global.authenticated);
  const user = useAppSelector((state) => state.global.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.global.page);
  // const location = useLocation();
  const signoutHandler = () => {
    window.localStorage.clear();
    dispatch(clearAuthenticated());
    dispatch(setUser({}));
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
          <a
            href={`${
              user.authorization === 'reviewer'
                ? '/reviewer/dashboard'
                : '/user/dashboard'
            } `}
          >
            <img src="/sidebar/dashboard.png" />
          </a>
        </div>
        <div
          className={` ${
            page === 'course' ? 'bg-blue-400' : ''
          } flex items-center justify-centerreview p-6 rounded-lg mt-10`}
        >
          <a href="/user/courses">
            <img src="/sidebar/courses.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'blog' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a href="/user/blog">
            <img src="/sidebar/resource.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'chat' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          {' '}
          <a href="/user/chat">
            <img src="/sidebar/chat.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'review' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a
            href={
              user.authorization === 'reviewer'
                ? '/reviewer/review'
                : `/user/review`
            }
          >
            <img src="/sidebar/review.png" />
          </a>
        </div>
        <div
          className={`${
            page === 'notification' ? 'bg-blue-400' : ''
          } flex items-center justify-center mt-10 p-6 rounded-lg`}
        >
          <a
            href={
              user.authorization === 'reviewer'
                ? '/user/notifications'
                : `/user/notifications`
            }
          >
            <img src="/sidebar/notification.png" />
          </a>
        </div>
        <img
          onClick={signoutHandler}
          className="mt-20 cursor-pointer"
          src="/sidebar/logout.png"
        />
        <a href="/user/profile" className="mt-10">
          <img
            className="bg-white h-6 w-6 rounded-full"
            src={
              user.profileImage?.includes('http')
                ? user.profileImage
                : user.profileImage
                ? `${url}/profile/${user.profileImage}`
                : '/user.png'
            }
          />
        </a>
      </nav>
      <Outlet />
    </>
  );
}
