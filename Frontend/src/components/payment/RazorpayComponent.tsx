import axios from 'axios';
import useRazorpay from 'react-razorpay';
import { toast } from 'react-toastify';
import url from '../../helper/backendUrl';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function PaymentButton() {
  const [Razorpay] = useRazorpay();

  //   const RAZORPAY_KEY_ID = import.meta.env.RAZORPAY_ID;
  const RAZORPAY_KEY_ID = 'rzp_test_wOLYOIp9WVnFFr';
  const createOrder = async (): Promise<string> => {
    try {
      const response = (
        await axios.post(
          `${url}/user/payment/order`,
          {
            amount: 10000,
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
          }
        )
      ).data;
      if (response.message === 'success') {
        return response.orderId;
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
      toast(error as string);
      return '';
    }
  };
  const handlePayment = async () => {
    try {
      // Make the API call to backend

      const orderId = await createOrder();
      console.log(orderId);
      // add option for the payment gateway it can be dynamic if you want
      // we can use prop drilling to make it dynamic
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: '10000',
        currency: 'INR',
        name: 'Your Company Name', // Add company details
        description: 'Payment for your order', // Add order details
        order_id: orderId,
        // this is make function which will verify the payment
        // after making the payment
        handler: async (response: RazorpayResponse) => {
          try {
            await fetch('http://localhost:3001/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },

              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            // Add onPaymentSuccessfull function here
            alert('Payment successful!');
          } catch (err) {
            // Add onPaymentUnSuccessfull function here
            alert('Payment failed: ' + err);
          }
        },
        prefill: {
          name: 'John Doe', // add customer details
          email: 'john@example.com', // add customer details
          contact: '9999999999', // add customer details
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          // you can change the gateway color from here according to your
          // application theme
          color: 'black',
        },
      };
      const rzpay = new Razorpay(options);
      // this will open razorpay window for take the payment in the frontend
      // under the hood it use inbuild javascript windows api
      rzpay.open();
    } catch (err) {
      alert('Error creating order: ' + err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="flex flex-col items-center justify-center font-bold bg-white text-blue-600 py-2 px-4 rounded shadow hover:bg-gray-200 transition"
    >
      <img src="/wallet/topup.png" className="h-8 w-8" alt="Top Up" />
      <p className="text-xs font-semibold mt-1">Top Up</p>
    </button>
  );
}
