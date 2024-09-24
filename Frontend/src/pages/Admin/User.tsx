import { ReactElement, useEffect, useState } from 'react';
import axiosInstance from '../../helper/axiosInstance';
import userProps from '../../types/userProps';
import url from '../../helper/backendUrl';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import PaginationComponent from '../../components/pagination/PaginationComponent';

export default function User(): ReactElement {
  const [users, setUsers] = useState<Array<userProps>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPage('users'));
    async function dataWrapper() {
      try {
        const response = (await axiosInstance.get(`/admin/users?page=${currentpage}`)).data;
        if (response.message === 'success') {
          setUsers(response.users);
          setPagecount(response.pageLength)
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    dataWrapper();
  }, [dispatch,currentpage]);

  const blockUser = (userId: string) => {
    // Implement block user functionality
    console.log(`Blocking user with ID: ${userId}`);
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10) + 1;
    const array = [];
    for (let i = 0; i < page; i++) {
      array.push(i + 1);
    }
    return array;
  };
  const previouspageHandler = () => {
    const prev = currentpage - 1;
    if (prev <= 0) {
      setCurrentpage(1);
      return;
    }
    setCurrentpage(prev);
  };
  const nextpageHandler = () => {
    const next = currentpage + 1;
    if (next > Math.ceil(pagecount / 10) + 1) {
      setCurrentpage(Math.ceil(pagecount / 10) + 1);
      return;
    }
    setCurrentpage(next);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl mb-6 w-full ml-52">USER MANAGEMENT</h1>
      <a className="mb-4" href="/admin/approvals">
        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
          Approvals
        </button>
      </a>

      {loading ? (
        <div className="loader">Loading...</div> // Add a spinner or loading animation here
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-200">
                  <th className="py-2 text-left px-4 font-semibold text-gray-700">
                    Profile
                  </th>
                  <th className="py-2 text-left px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-2 text-left px-4 font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="py-2 text-left px-4 font-semibold text-gray-700">
                    Authorization
                  </th>
                  <th className="py-2 text-left px-4 font-semibold text-gray-700">
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td>
                      <img
                        src={
                          user.profileImage?.includes('http')
                            ? user.profileImage
                            : user.profileImage
                            ? `${url}/profile/${user.profileImage}`
                            : '/user.png'
                        }
                        className="h-10 w-10 rounded-full mt-4 border-4 border-gray-300 cursor-pointer transition-transform hover:scale-105"
                        alt="Profile"
                      />{' '}
                    </td>
                    <td className="py-2 px-4 text-lg">{user.email}</td>
                    <td className="py-2 px-4">{user.address}</td>
                    <td className="py-2 px-4">
                      {user.authorization ?? 'user'}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => blockUser(user._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition"
                      >
                        Block
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationComponent
          previouspageHandler={previouspageHandler}
          nextpageHandler={nextpageHandler}
          pageHandler={pageHandler}
          pagecount={pagecount}
          currentpage={currentpage}
        />
        </div>
      )}
    </div>
  );
}
