import { ReactElement, Ref, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import useRazorpay from 'react-razorpay';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import axiosInstance from '../../helper/axiosInstance';
import { setFailedPayment, setUpdatedWallet } from '../../store/globalSlice';

type Inputs = {
  amount: string;
};

interface orderProps {
  id: string;
  amount: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentError {
    error:{
        code: string;                 // The error code
        description: string;          // A human-readable description of the error
        source: string;               // The source of the error (e.g., Razorpay)
        step: string;                 // The step at which the error occurred
        reason: string;               // The reason for the failure
        metadata: {
            order_id: string;         // The ID of the order associated with the payment
            payment_id: string;       // The ID of the payment attempt
        };
    }
}

export default function PaymentDialog({
  dialogRef,
  closeHandler,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [Razorpay] = useRazorpay();
  const user = useAppSelector((state) => state.global.user);
  const dispatch=useAppDispatch()
  const toastHandler=()=>{
    toast("added successfully")
  }
  const handlePayment = async (order: orderProps) => {
    try {
      const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Review Hub',
        description: 'Payment for your order',
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            await axiosInstance.post(
              '/user/payment/order/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );
            toastHandler()
            //here implement the state update
            dispatch(setUpdatedWallet(parseInt(order.amount)/100))     
            // window.location.reload();
          } catch (err) {
            toast('Payment failed: ' + err);
          }
        },
        prefill: {
          name: user.email,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#001C27',
        },
      };
      const rzpay = new Razorpay(options);
      rzpay.on('payment.failed',async (response:RazorpayPaymentError)=>{
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        if(response.error.metadata.payment_id){
            const serverResponse=(
                await axiosInstance.put(`/user/payment/order/failure/${response.error.metadata.order_id}`,{})
            ).data
            console.log(serverResponse) 
            dispatch(setFailedPayment(parseInt(order.amount)/100))
            // window.location.reload()      
        }
      })
      rzpay.open();

    } catch (err) {
      toast('Error creating order: ' + err);
    }
  };

  const createOrder = async (amount: string): Promise<orderProps | null> => {
    try {
      const response = (
        await axiosInstance.post(
          `/user/payment/order`,
          { amount: (parseInt(amount) * 100).toString() },
        )
      ).data;
      return response.message === 'success' ? response.order : null;
    } catch (error) {
      console.log(error);
      toast('Error creating order: ' + error);
      return null;
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const response = await createOrder(data.amount);
    if (response) {
      handlePayment(response);
      closeHandler();
    } else {
      toast('Please try again');
    }
    setLoading(false);
  };

  return (
    <>
      <dialog
        className="h-96 w-96 bg-white shadow-lg rounded-lg p-6 flex flex-col"
        ref={dialogRef}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={closeHandler}
        >
          <span className="material-icons">close</span>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Payment Amount</h2>
        <form
          className="flex flex-col justify-center h-full w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="number"
            className={`border rounded-md p-3 w-full mb-3 transition-colors duration-200 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter amount (INR)"
            {...register('amount', {
              required: { value: true, message: 'Please enter the amount' },
              min: { value: 10, message: 'Minimum amount is 10' },
              validate: (value: string) =>
                value.trim() === '' ? 'Please enter a valid amount' : true,
            })}
          />
          {errors.amount && (
            <span className="text-xs text-red-500 mb-2">
              {errors.amount.message}
            </span>
          )}
          <ClipLoader loading={loading} />
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white font-semibold rounded-md py-2 transition-colors duration-200 hover:bg-blue-600"
          >
            {loading ? 'Processing...' : 'Top Up'}
          </button>
        </form>
      </dialog>
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </>
  );
}
