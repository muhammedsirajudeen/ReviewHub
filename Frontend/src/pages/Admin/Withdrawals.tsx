import { ReactElement, useEffect, useState } from 'react';
import DashboardTopbar from '../../components/DashboardTopbar';
import axiosInstance from '../../helper/axiosInstance';
import withdrawalProps from '../../types/withdrawalProps';
import url from '../../helper/backendUrl';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Install react-icons
import { toast, ToastContainer } from 'react-toastify';
import { produce } from 'immer';
export default function Withdrawals(): ReactElement {
  const [withdrawals, setWithdrawals] = useState<withdrawalProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function withdrawalFetcher() {
      try {
        const response = (await axiosInstance.get('/admin/withdrawals')).data;
        if (response.message === 'success') {
          setWithdrawals(response.withdrawals);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    withdrawalFetcher();
  }, []);
  const approveHandler = async (id: string) => {
    console.log(id);
    try {
        const response=(
            await axiosInstance.put(`/admin/withdrawal/${id}`,{approval:true})
        ).data
        if(response.message==="success"){
            toast.success("approved successfully")
            setWithdrawals(produce((draft)=>{
                draft.map((draft)=>{
                    if(draft._id===id){
                        draft.status=true
                    }
                })
            }))

        }
    } catch (error) {
        console.log(error)
        toast.error("please try again")
    }
  };
  const rejectHandler = (id: string) => {
    console.log(id);
  };
  return (
    <>
      <DashboardTopbar />
      <h1 className="text-4xl ml-36 mt-8 mb-4">Withdrawals</h1>
      <div className="flex flex-col items-center ml-36">
        {loading ? (
          <div className="loader">Loading...</div> // You can style this loader
        ) : (
          withdrawals.map((withdrawal) => {
            return (
              <div
                key={withdrawal._id}
                className="flex flex-col bg-white shadow-lg rounded-lg p-4 mt-4 w-3/4"
              >
                <div className="flex items-center justify-between">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={
                      withdrawal.userId.profileImage?.includes('http')
                        ? withdrawal.userId.profileImage
                        : withdrawal.userId.profileImage
                        ? `${url}/profile/${withdrawal.userId.profileImage}`
                        : '/user.png'
                    }
                  />
                  <div className="flex-grow ml-4">
                    <div className="text-lg font-semibold">
                      {withdrawal.userId.email}
                    </div>
                    <div className="text-gray-500">
                      ${withdrawal.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {withdrawal.status ? (
                      <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                        <FaCheck className="mr-1" /> Approved
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => approveHandler(withdrawal._id)}
                          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => rejectHandler(withdrawal._id)}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <ToastContainer
          style={{
            backgroundColor: 'gray',
            color: 'white',
            borderRadius: '10px',
          }}
        />
      </div>
    </>
  );
}
