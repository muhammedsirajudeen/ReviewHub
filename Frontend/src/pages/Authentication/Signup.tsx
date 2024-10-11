import { ReactElement, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import OtpForm from '../../components/Form/Authentication/OtpForm';
import { flushSync } from 'react-dom';
import axiosInstance from '../../helper/axiosInstance';
import { AuthPath } from '../../types/pathNames';
interface FormValues {
  email: string;
  password: string;
}
export default function Signup(): ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const data = useLoaderData();
  const [submit, setSubmit] = useState<boolean>(false);
  const [otpdialog, setOtpdialog] = useState<boolean>(false);
  const otpDialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  const roleRef = useRef<string | null>(
    location.state ? location.state.role : null
  );
  useEffect(() => {
    const timer = localStorage.getItem('timer');
    console.log(timer);
    if (timer) {
      queueMicrotask(() => {
        flushSync(() => {
          setOtpdialog(true);
        });
        otpDialogRef.current?.showModal();
      });
    }
  }, []);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Handle form submission
    setSubmit(true);
    const response = await axiosInstance.post('/auth/credential/signup', {
      email: data.email,
      password: data.password,
      role: roleRef.current,
    });
    if (response.data.message === 'success') {
      flushSync(() => {
        toast('user created successfully');
        localStorage.setItem('verifyemail', data.email);
        window.localStorage.setItem('timer', '20');
        setOtpdialog(true);
      });
      otpDialogRef.current?.showModal();
      // setTimeout(() => navigate("/signin"), 1000);
    } else {
      console.log(response);
      toast(response.data.message);
    }
    setSubmit(false);
  };
  const closeHandler = () => {
    otpDialogRef.current?.close();
    setOtpdialog(false);
  };

  useEffect(() => {
    if (data) {
      navigate('/dashboard');
    }
  }, [navigate, data]);
  const googleHandler = useGoogleLogin({
    onSuccess: async (codeResponse: TokenResponse) => {
      console.log(codeResponse);
      const response = await axiosInstance.post('/auth/google/signup', {
        userToken: codeResponse.access_token,
        role: roleRef.current,
      });
      console.log(response);
      if (response.status === 201 && response.data.message === 'success') {
        toast('success');
        if (roleRef.current === 'reviewer') {
          setTimeout(() =>
            navigate(AuthPath.signin, { state: { role: 'reviewer' } })
          );
        }
        setTimeout(() => navigate(AuthPath.signin), 1000);
      } else {
        toast(response.data.message);
      }
    },
    onError: (error) => console.log(error),
  });

  return (
    <>
      <div className="flex items-center justify-center">
        <ToastContainer
          style={{
            backgroundColor: 'gray',
            color: 'white',
            borderRadius: '10px',
          }}
        />
        <img src="login/signupperson.png" className="absolute -z-10 right-96" />

        <div className="h-auto flex flex-col items-center justify-start w-96 shadow-2xl mt-40 rounded-xl p-10">
          <p className="text-2xl text-gray-black font-bold mt-10">ReviewHub.</p>
          <p className="text-xs text-gray-500 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>{' '}
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="text-xs mt-5">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
              placeholder="enter the email address"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}

            <label htmlFor="password" className="text-xs mt-5">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
              placeholder="enter the password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be atleast 8 characters Long',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}

            <button
              onClick={() => googleHandler()}
              className="h-10 w-72 bg-white border mt-5 rounded-3xl border-gray-500 flex items-center justify-start"
            >
              <img src="google.png" className="h-5 w-5 ml-2" />
              <p className="text-xs font-normal ml-14">Create Your Account</p>
            </button>
            <button
              type="submit"
              disabled={submit}
              className="h-10 w-72 bg-blue-200 mt-5 text-blue-600 text-xs flex items-center justify-center"
            >
              CREATE YOUR ACCOUNT
            </button>
          </form>
        </div>
      </div>
      {otpdialog && (
        <OtpForm
          type=""
          role={roleRef.current}
          email={watch('email')}
          closeHandler={closeHandler}
          dialogRef={otpDialogRef}
        />
      )}
    </>
  );
}
