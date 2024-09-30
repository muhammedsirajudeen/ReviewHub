import { ReactElement, useEffect, useRef, useState } from 'react';
import DashboardTopbar from '../../components/DashboardTopbar';
import axiosInstance from '../../helper/axiosInstance';
import withdrawalProps, {
  paymentMethodprops,
} from '../../types/withdrawalProps';
import url from '../../helper/backendUrl';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Install react-icons
import { toast, ToastContainer } from 'react-toastify';
import { produce } from 'immer';
import PaginationComponent from '../../components/pagination/PaginationComponent';
import { flushSync } from 'react-dom';
export default function Withdrawals(): ReactElement {
  const [withdrawals, setWithdrawals] = useState<withdrawalProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const [paymentmethod, setPaymentmethod] = useState<paymentMethodprops>();
  const [detail, setDetail] = useState<boolean>(false);
  const detailRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    async function withdrawalFetcher() {
      try {
        const response = (await axiosInstance.get('/admin/withdrawals')).data;
        if (response.message === 'success') {
          setWithdrawals(response.withdrawals);
          setPagecount(response.pageLength);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    withdrawalFetcher();
  }, []);
  const approveHandler = async (id: string, status: boolean) => {
    console.log(id);
    try {
      const response = (
        await axiosInstance.put(`/admin/withdrawal/${id}`, { approval: status })
      ).data;
      if (response.message === 'success') {
        if (status) {
          setWithdrawals(
            produce((draft) => {
              draft.map((draft) => {
                if (draft._id === id) {
                  draft.status = 'approved';
                }
              });
            })
          );

          toast.success('approved successfully');
        } else {
          setWithdrawals(
            produce((draft) => {
              draft.map((draft) => {
                if (draft._id === id) {
                  draft.status = 'rejected';
                }
              });
            })
          );
          toast.error('transaction rejected');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('please try again');
    }
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10);
    return Array.from({ length: page }, (_, i) => i + 1);
  };

  const previouspageHandler = () => {
    setCurrentpage((prev) => Math.max(prev - 1, 1));
  };

  const nextpageHandler = () => {
    setCurrentpage((prev) => Math.min(prev + 1, Math.ceil(pagecount / 10)));
  };
  const detailsHandler = (withdrawal: withdrawalProps) => {
    console.log(withdrawal.paymentMethod);
    setPaymentmethod(withdrawal.paymentMethod[0]);
    flushSync(() => {
      setDetail(true);
    });
    detailRef.current?.showModal();
  };

  return (
    <>
      <DashboardTopbar />
      <h1 className="text-4xl ml-36 mt-8 mb-4">WITHDRAWALS</h1>
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
                    {/* view the payment details here */}
                    <button
                      onClick={() => detailsHandler(withdrawal)}
                      className="bg-blue-800 text-white p-2 text-xs"
                    >
                      Details
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {withdrawal.status === 'approved' ? (
                      <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                        <FaCheck className="mr-1" /> Approved
                      </button>
                    ) : withdrawal.status === 'rejected' ? (
                      <button
                        onClick={() => approveHandler(withdrawal._id, false)}
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                      >
                        <FaTimes className="mr-1" /> Reject
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => approveHandler(withdrawal._id, true)}
                          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => approveHandler(withdrawal._id, false)}
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
        <PaginationComponent
          previouspageHandler={previouspageHandler}
          nextpageHandler={nextpageHandler}
          pageHandler={pageHandler}
          pagecount={pagecount}
          currentpage={currentpage}
        />
      </div>
      {detail && (
        <dialog
          className="relative w-96 p-6 bg-white rounded-lg shadow-lg"
          ref={detailRef}
          onClose={() => setDetail(false)}
        >
          <button
            className="absolute top-2 right-2 text-lg text-gray-500 hover:text-gray-800 transition duration-200"
            onClick={() => {
              setDetail(false);
              detailRef.current?.close();
            }}
            aria-label="Close dialog"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Method Details
          </h2>
          {paymentmethod ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Bank Account:</span>
                <span className="text-gray-600">
                  {paymentmethod.bankaccount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Account Holder:
                </span>
                <span className="text-gray-600">
                  {paymentmethod.holdername}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">IFSC Code:</span>
                <span className="text-gray-600">{paymentmethod.ifsc}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              No payment method details available.
            </p>
          )}
          <button
            className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            onClick={() => {
              setDetail(false);
              detailRef.current?.close();
            }}
          >
            Close
          </button>
        </dialog>
      )}
    </>
  );
}
