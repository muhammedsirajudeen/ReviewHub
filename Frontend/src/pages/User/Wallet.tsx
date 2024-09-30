import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {  ToastContainer } from 'react-toastify';
import PaymentDialog from '../../components/payment/PaymentDialog';
import { flushSync } from 'react-dom';
import WithdrawalDialog from '../../components/payment/WithdrawalDialog';
// import PaymentButton from '../../components/payment/RazorpayComponent';



export default function Wallet(): ReactElement {
  const [active, setActive] = useState<string>('All');
  const user = useAppSelector((state) => state.global.user);
  const [payment,setPayment]=useState<boolean>(false)
  const paymentdialogRef=useRef<HTMLDialogElement>(null)
  const [withdrawal,setWithdrawal]=useState<boolean>(false)
  const withdrawaldialogRef=useRef<HTMLDialogElement>(null)
  useEffect(() => {
    setActive('All');
  }, []);

  const activeHandler = (section: string) => {
    setActive(section);
  };
  const topupHandler=()=>{
    flushSync(()=>setPayment(true))
    paymentdialogRef.current?.showModal()
  }
  const closeHandler=()=>{
    setPayment(false)
    paymentdialogRef.current?.close()
  }
  const withdrawalHandler=()=>{
    flushSync(()=>{
      setWithdrawal(true)
    })
    withdrawaldialogRef.current?.showModal()
  }
  const withdrawalCloseHandler=()=>{
    withdrawaldialogRef.current?.close()
    setWithdrawal(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center ml-36 mb-10 relative">
        <div className="h-64 w-80 shadow-xl rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white p-6 cursor-pointer absolute right-0 mr-10 top-20">
          <div className="text-center text-xs font-bold mb-3">
            <span className="font-bold text-4xl">
              {new Date().getDate()}
              <span className="text-sm">th</span>
            </span>
            <div className="font-bold text-sm">
              {new Date().toLocaleString('default', { month: 'long' })}{' '}
              {new Date().getFullYear()}
            </div>
          </div>
          <div className="flex items-center justify-center mt-2">
            <img
              src="/quiz/reward.png"
              alt="Reward Icon"
              className="h-12 w-12 object-contain"
            />
            <p className="text-3xl font-bold ml-2">
              {user.walletId?.balance?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="flex items-center w-full justify-between mt-4">
             {/* <PaymentButton/> */}
             <button
                onClick={topupHandler}
                className="flex flex-col items-center justify-center font-bold bg-white text-blue-600 py-2 px-4 rounded shadow hover:bg-gray-200 transition"
            >
            <img src="/wallet/topup.png" className="h-8 w-8" alt="Top Up" />
            <p className="text-xs font-semibold mt-1">Top Up</p>
            </button>
            <button
                onClick={withdrawalHandler}
                 className="flex flex-col items-center justify-center font-bold bg-white text-blue-600 py-2 px-4 rounded shadow hover:bg-gray-200 transition">
              <img
                src="/wallet/withdraw.png"
                className="h-8 w-8"
                alt="Withdraw"
                
              />
              <p className="text-xs font-semibold mt-1">Withdraw</p>
            </button>
          </div>
        </div>

        {/* Main content: wallet history */}
        <div className="flex w-full h-full items-center justify-center mt-80">
          <div className="w-3/4 h-full flex flex-col bg-white rounded-lg shadow-lg p-5">
            <div className="flex items-center justify-around w-full mb-4">
              {['All', 'Approved', 'Rejected'].map((section) => (
                <button
                  key={section}
                  onClick={() => activeHandler(section)}
                  className={`font-semibold py-2 px-4 rounded transition ${
                    active === section
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto h-72">
              <div className="flex items-center justify-between w-full border-b border-gray-200 py-2">
                <p className="w-2/3 text-gray-700 font-bold">Date</p>
                <p className="w-1/4 text-gray-700 font-bold">Amount</p>
                <p className="w-1/4 text-gray-700 font-bold">Type</p>
              </div>
              {user.walletId?.history?.map((history, index) => (
                <div
                  key={index}
                  className={`text-black flex items-center font-bold text-lg justify-between w-full border-b border-gray-200 py-2`}
                >
                  <p className="w-2/3">{history.paymentDate}</p>
                  <p className={`${history.status ? "text-green-500" : "text-red-500" } w-1/4`}>{history.amount}</p>
                  <p className="w-1/4">{history.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <img
          className="absolute top-3/4 left-0  transform -translate-x-1/2 -translate-y-1/2 -z-10"
          src="/wallet/walletbg.png"
          alt="Wallet Background"
        />
      </div>
      
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
      {
        payment && (
            <PaymentDialog dialogRef={paymentdialogRef}  closeHandler={closeHandler}/>
        )
      }
      {
        withdrawal && 
        <WithdrawalDialog dialogRef={withdrawaldialogRef} closeHandler={withdrawalCloseHandler}/>
      }
    </>
  );
}
