import { ReactElement, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  TokenResponse,
  useGoogleLogin,
  UseGoogleLoginOptionsImplicitFlow,
} from '@react-oauth/google';
// import { useLoaderData, useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hooks';
import { setAuthenticated, setUser } from '../../store/globalSlice';
import { tokenVerifier } from '../../helper/tokenVerifier';
// import userProps from "../../types/userProps";
import { ClipLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router';
import { flushSync } from 'react-dom';
import OtpForm from '../../components/Form/Authentication/OtpForm';
import axiosInstance from '../../helper/axiosInstance';
import { AuthPath } from '../../types/pathNames';
import { AxiosError } from 'axios';
interface FormValues {
  email: string;
  password: string;
}
export default function Login(): ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [otpdialog, setOtpdialog] = useState<boolean>(false);
  const otpDialogRef = useRef<HTMLDialogElement>(null);
  const [submit, setSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const location = useLocation();
  const roleRef = useRef<string | null>(null);
  useEffect(() => {
    roleRef.current = location.state ? location.state.role : null;
  }, [location.state, roleRef]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSubmit(true);
    const response = await axiosInstance.post('/auth/credential/signin', {
      email: data.email,
      password: data.password,
    });
    if (response.data.message === 'success') {
      toast('signed in successfully');
      dispatch(setAuthenticated());

      window.localStorage.setItem('token', response.data.token);
      window.localStorage.setItem('refresh_token', response.data.refresh_token);
      const user = await tokenVerifier();
      console.log('the user is', user);
      if (user) dispatch(setUser(user));
      if (roleRef.current === 'reviewer') {
        setTimeout(() => navigate('/reviewer/approval'), 1000);
        return;
      }
      setTimeout(() => navigate('/user/dashboard'), 1000);
    } else {
      toast(response.data.message);
    }
    setSubmit(false);
  };
  const googleHandler = useGoogleLogin({
    onSuccess: async (codeResponse: TokenResponse) => {
      console.log(codeResponse);
      try {
        const response = await axiosInstance.post('/auth/google/login', {
          userToken: codeResponse.access_token,
        });
        console.log(response);
        if (response.status === 200 && response.data.message === 'success') {
          window.localStorage.setItem('token', response.data.token);
          window.localStorage.setItem(
            'refresh_token',
            response.data.refresh_token
          );
  
          dispatch(setAuthenticated());
          const user = await tokenVerifier();
          if (user) dispatch(setUser(user));
  
          if (response.data.admin) {
            navigate('/admin/dashboard');
            return;
          }
          navigate('/user/dashboard');
        } else {
          toast(response.data.message);
        }
      } catch (error) {
        console.log(error)
        const axiosError=error as AxiosError
        if(axiosError.status===404){
          toast.error("Please signup first")
        }
      }

    },
    onError: (error) => console.log(error),
    // ux_mode:'redirect',
    prompt: 'select_account',
  } as UseGoogleLoginOptionsImplicitFlow);

  async function forgotHandler() {
    setLoading(true);
    const email = watch('email');
    if (!email) {
      toast('enter an email first');
    } else {
      try {
        const response = (
          await axiosInstance.post('/auth/resend', {
            email: email,
          })
        ).data;
        if (response.message === 'success') {
          window.localStorage.setItem('email', email);
          toast('check your email');
          setTimeout(() => {
            flushSync(() => {
              setType('forgot');
              setOtpdialog(true);
            });
            otpDialogRef.current?.showModal();
          }, 1000);
        } else {
          toast(response.message);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  }
  const closeHandler = () => {
    setOtpdialog(false);
    otpDialogRef.current?.close();
  };
  return (
    <>
      <img src="login/loginperson.png" className="absolute left-96 -z-10" />
      <div className="flex items-center justify-center z-10 ">
        <div className="h-auto flex flex-col items-center justify-start w-96 shadow-2xl mt-40 rounded-xl p-10">
          <p className="text-2xl text-gray-black font-bold mt-10">ReviewHub.</p>
          <p className="text-xs text-gray-500 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="text-xs mt-5">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
              placeholder="enter the email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
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
              type="button"
              onClick={forgotHandler}
              className="text-xs text-end mt-3 font-light"
            >
              forgot password?
            </button>
            <div className="flex items-center justify-center">
              <ClipLoader
                color={'black'}
                loading={loading}
                // cssOverride={override}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            <button
              disabled={submit}
              type="submit"
              className="h-10 w-72 bg-signin-button mt-5 text-white text-xs flex items-center justify-center"
            >
              SIGN IN
            </button>

            <button
              onClick={() => googleHandler()}
              className="h-10 w-72 bg-white border mt-5 rounded-3xl border-gray-500 flex items-center justify-start"
            >
              <img src="google.png" className="h-5 w-5 ml-2" />
              <p className="text-xs font-normal ml-14">Sign in Using Google</p>
            </button>
            <a
              href={AuthPath.signup}
              className="h-10 w-72 bg-blue-200 mt-5  text-blue-600 text-xs flex items-center justify-center"
            >
              CREATE YOUR ACCOUNT
            </a>
          </form>
        </div>
      </div>
      {otpdialog && (
        <OtpForm
          role={roleRef.current}
          type={type}
          dialogRef={otpDialogRef}
          closeHandler={closeHandler}
          email={watch('email')}
        />
      )}
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
