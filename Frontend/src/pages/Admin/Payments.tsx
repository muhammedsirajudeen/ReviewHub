import { ReactElement, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../helper/axiosInstance';
import paymentProps from '../../types/paymentProps';
import PaginationComponent from '../../components/pagination/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import PaymentFilterBar from '../../components/Filter/PaymentFilter';
import PaymentTopBar from '../../components/Topbar/PaymentTopBar';
import { flushSync } from 'react-dom';
import PaymentDetailsDialog from '../../components/Dialog/PaymentDetailsDialog';

export default function Payments(): ReactElement {
  const [payments, setPayments] = useState<paymentProps[]>([]);
  const [payment,setPayment]=useState<paymentProps>()
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const paymentDetailsRef=useRef<HTMLDialogElement>(null)
  const [paymentdetails,setPaymentdetails]=useState<boolean>(false)

  const date=useAppSelector((state)=>state.global.filterProps.date)
  const status=useAppSelector((state)=>state.global.filterProps.status)
  const dispatch=useAppDispatch()
  useEffect(() => {
    dispatch(setPage('payments'))
    async function dataWrapper() {
      try {
        let statusValue:string | null=null
        if(status!=null){
          statusValue=status ? "success" : "failed"
        } 
        const response = (
          await axiosInstance.get(`/admin/payments?page=${currentpage}&date=${date ?? undefined}&status=${statusValue ??  undefined}`)
        ).data;
        if (response.message === 'success') {
          setPayments(response.payments);
          setPagecount(response.pageLength);
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    dataWrapper();
  }, [currentpage, date, dispatch, status]);

  const paymentDetailsHandler=(payment:paymentProps)=>{
    flushSync(()=>{
      setPaymentdetails(true)
      setPayment(payment)
    })
    paymentDetailsRef.current?.showModal()
  }
  const closePaymentDetailsHandler=()=>{
    flushSync(()=>{
      setPaymentdetails(false)
    })
    paymentDetailsRef.current?.close()
  }

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

  return (
    <>
      <PaymentTopBar setResults={setPayments} />
      <h1 className="text-4xl ml-36 mt-4 mb-6">Payments</h1>
      <a href='/admin/withdrawals' className='ml-36  mt-4 mb-4 text-xl border border-b-black border-t-white border-l-white border-r-white' >Withdrawals</a>
      <PaymentFilterBar currentpage={currentpage}/>
      <div className="ml-36 mb-6 border rounded-lg shadow-lg p-4 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                User Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Payment Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payment?.userId?.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payment.orderId}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payment.type}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                      payment.status
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {payment.status ? 'Success' : 'Failed'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                      <button onClick={()=>paymentDetailsHandler(payment)} className='bg-blue-950 text-white p-1 rounded-lg' >Details</button>
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
      {
        paymentdetails && 
        (
          <PaymentDetailsDialog payment={payment} closeHandler={closePaymentDetailsHandler} dialogRef={paymentDetailsRef} />
        )
      }
    </>
  );
}
