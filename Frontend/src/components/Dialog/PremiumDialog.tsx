import { ReactElement, Ref, useState } from 'react';
import useRazorpay from 'react-razorpay';
import {
  RazorpayPaymentError,
  RazorpayResponse,
} from '../payment/PaymentDialog';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import axiosInstance from '../../helper/axiosInstance';
import { ClipLoader } from 'react-spinners';
import { setPremium } from '../../store/globalSlice';

export default function PremiumDialog({
  dialogRef,
  closeHandler,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
}): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [Razorpay] = useRazorpay();
  const PREMIUM_AMOUNT = 4868;
  const user = useAppSelector((state) => state.global.user);
  const dispatch=useAppDispatch()
  const createOrder = async (): Promise<string | null> => {
    try {
      const response = (await axiosInstance.post('/user/premium')).data;
      if (response.message === 'success') {
        return response.orderId;
      } else {
        return null;
      }

      return 'success';
    } catch (error) {
      console.log(error);
      toast('Error creating order: ' + error);
      return null;
    }
  };
  const paymentHandler = async () => {
    try {
      setLoading(true);
      const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;
      const orderId = await createOrder();
      setLoading(false);
      closeHandler();

      if (!orderId) {
        toast.error('try again');
        return;
      }
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: PREMIUM_AMOUNT.toString(),
        currency: 'INR',
        name: 'Review Hub',
        description: 'Payment for your order',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            //handle success here
            console.log(response);
            try {
              const apiResponse = (
                await axiosInstance.post('/user/premium/verify', response)
              ).data;
              if (apiResponse.message === 'success') {
                dispatch(setPremium(true))
                // window.location.reload();
              } else {
                console.log('error');
              }
            } catch (error) {
              console.log(error);
            }
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
      rzpay.on('payment.failed', async (response: RazorpayPaymentError) => {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        if (response.error.metadata.payment_id) {
          if (response.error.metadata.payment_id) {
            const serverResponse = (
              await axiosInstance.put(
                `/user/payment/order/failure/${response.error.metadata.order_id}`,
                { premium: true }
              )
            ).data;
            console.log(serverResponse);
            window.location.reload();
          }
        }
      });
      rzpay.open();
    } catch (err) {
      toast('Error creating order: ' + err);
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="flex items-center justify-center flex-col p-8 bg-white shadow-lg rounded-lg"
      style={{ height: '70vh', width: '80vw', border: 'none' }}
    >
      <button
        onClick={closeHandler}
        className="self-end text-gray-600 hover:text-gray-900 transition duration-200"
        aria-label="Close dialog"
      >
        &times;
      </button>
      <h1 className="text-4xl font-bold mb-4 text-center text-black">
        Become A Member For Life
      </h1>
      <div className="h-96 w-96 bg-gradient-to-r bg-navbar rounded-xl flex items-center flex-col justify-center mb-4 shadow-lg">
        {/* Placeholder for image or content */}
        <h1 className="text-gold-400 font-bold text-3xl">
          Membership For Life
        </h1>
        <span className="text-white text-sm">Unlock Premium Benefits</span>
        <p className="text-4xl  font-bold mt-4 text-gold-400">₹ 4,868</p>
      </div>
      <p className="text-lg text-center mb-6 text-gray-700">
        Unlock exclusive features, discounts, and a vibrant community.
      </p>
      <ClipLoader loading={loading} />
      <button
        onClick={paymentHandler}
        className="bg-gold-500 text-gold-400 bg-navbar font-semibold py-3 px-8 rounded-lg hover:bg-gold-600 transition duration-300 transform hover:scale-105"
      >
        Join Now
      </button>
    </dialog>
  );
}
