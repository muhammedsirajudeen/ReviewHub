import axios from 'axios';
import { ReactElement, Ref, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import url from '../../../helper/backendUrl';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

interface FormData {
  otp: string;
}

export default function OtpForm({
  dialogRef,
  closeHandler,
  email,
  type,
  role,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  email: string;
  type: string | undefined;
  role: string | null;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const [resend, setResend] = useState<boolean>(true);
  const [time, setTime] = useState<number>(5);
  useEffect(() => {
    const timerid = setInterval(() => {
      if (time > 0) {
        setTime((time) => time - 1);
      } else {
        setResend(false);
      }
    }, 1000);
    return () => {
      clearInterval(timerid);
    };
  }, [time]);

  const onSubmit = async (data: FormData) => {
    console.log('OTP submitted:', data.otp);
    try {
      const response = (
        await axios.post(`${url}/auth/otp/verify`, {
          otp: data.otp,
          email,
        })
      ).data;
      if (response.message === 'success') {
        toast('otp verified');
        console.log(type);
        if (type) {
          setTimeout(() => navigate('/forgot'), 1000);
          return;
        }
        if (role) {
          setTimeout(
            () => navigate('/signin', { state: { role: 'reviewer' } }),
            1000
          );
          return;
        }
        setTimeout(() => navigate('/signin'), 1000);
      } else {
        toast(response.message);
      }
    } catch (error) {
      console.log(error);
      toast('otp verification failed');
    }
  };
  const resendHandler = async () => {
    const response = (
      await axios.post(`${url}/auth/resend`, {
        email,
      })
    ).data;
    if (response.message === 'success') {
      toast('success');
      setTime(5);
      setResend(true);
    } else {
      toast(response.message);
    }
  };

  return (
    <>
      <dialog
        className="h-96 w-96 p-6 flex flex-col items-center"
        ref={dialogRef}
      >
        <button className="self-end" onClick={closeHandler}>
          x
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <label htmlFor="otp" className="block text-center mb-2">
            Enter OTP from Email:
          </label>
          <input
            id="otp"
            type="text"
            maxLength={4}
            className={`border p-2 w-full text-center ${
              errors.otp ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('otp', {
              required: 'OTP is required',
              pattern: {
                value: /^[0-9]{4}$/,
                message: 'Must be 4 digits',
              },
            })}
          />
          {errors.otp && (
            <p className="text-red-500 text-center mt-2">
              {errors.otp.message}
            </p>
          )}
          <button
            type="button"
            disabled={resend}
            className={`mt-4 p-2 ${
              resend
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:bg-blue-100'
            }`}
            onClick={resendHandler}
          >
            {resend ? `Resend in ${time}s` : 'Resend'}
          </button>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </dialog>
    </>
  );
}
