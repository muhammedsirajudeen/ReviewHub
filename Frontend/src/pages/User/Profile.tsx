import axios from 'axios';
import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import url from '../../helper/backendUrl';
import { toast, ToastContainer } from 'react-toastify';
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router';
import { flushSync } from 'react-dom';
import PremiumDialog from '../../components/Dialog/PremiumDialog';

interface FormValues {
  phone: string;
  address: string;
  image: File;
}

export default function Profile(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [premiumdialog,setPremiumdialog]=useState<boolean>(false)
  const premiumDialogRef=useRef<HTMLDialogElement>(null)
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.global.user);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('email', user?.email ?? '');
    if (fileRef.current?.files) {
      formData.append('file', fileRef.current?.files[0]);
    }

    try {
      const response = await axios.post(url + '/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });
      if (response.data.message === 'success') {
        toast('Profile updated successfully');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.log(error);
      toast('Please try again');
    }
  };

  const imageHandler = () => {
    fileRef.current?.click();
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const file = e.target.files[0];

      if (file.size > maxSize) {
        toast('File size must be less than 2MB');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast('Invalid file type');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageRef.current) {
          imageRef.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const walletnavHandler = () => {
    navigate('/user/wallet');
  };

  const premiumHandler=()=>{
    flushSync(()=>{
      setPremiumdialog(true)
    })
    premiumDialogRef.current?.showModal()
  }
  const closePremiumHandler=()=>{
    premiumDialogRef.current?.close()
    setPremiumdialog(false)
  }

  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="h-auto p-8 w-96 bg-white shadow-xl rounded-2xl flex flex-col items-center">
        {/* Wallet Component */}
        <div
          onClick={walletnavHandler}
          className="h-40 right-0 mr-10 absolute w-60 shadow-lg rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center flex-col bg-gradient-to-r from-green-400 to-green-500 text-white p-4 cursor-pointer mb-6"
        >
          <div className="text-xs font-bold w-full items-center justify-center flex">
            <span className="font-bold text-3xl m-1">
              {new Date().getDate()}
              <span className="text-xs">th</span>
            </span>
            <span className="font-bold text-xs m-1">
              {new Date(
                new Date().getFullYear(),
                new Date().getMonth()
              ).toLocaleString('default', { month: 'long' })}
            </span>
            <span className="font-bold text-xs m-1">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center justify-center mt-2">
            <img
              src="/quiz/reward.png"
              alt="Reward Icon"
              className="h-8 w-8 object-contain"
            />
            <p className="text-2xl font-bold ml-2">
              {user.walletId?.balance?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Links to Profile Sections */}
        <div className="flex w-full items-center justify-evenly mb-4">
          <a
            className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors"
            href="/user/enrolled"
          >
            Courses
          </a>
          <a
            className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors"
            href="/user/reviews"
          >
            Reviews
          </a>
          {/* <a
            className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors"
            href="/user/feedback"
          >
            Favorite
          </a> */}
        </div>

        <h1 className="font-semibold text-2xl mt-4 mb-4">Profile</h1>
        <div className="flex w-96 items-center justify-evenly">

          <button
            className="self-end text-red-500 text-2xl"
            onClick={() => window.location.reload()}
          >
            &times;
          </button>
        </div>

        <img
          ref={imageRef}
          src={
            user.profileImage?.includes('http')
              ? user.profileImage
              : user.profileImage
              ? `${url}/profile/${user.profileImage}`
              : '/user.png'
          }
          className="h-48 w-48 rounded-full mt-4 border-4 border-gray-300 cursor-pointer transition-transform hover:scale-105"
          onClick={imageHandler}
          alt="Profile"
        />

        <p className="text-sm font-light mt-2">{user?.email}</p>
        <button disabled={user.premiumMember} onClick={premiumHandler} className="m-10 flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            <img
              src="/premium/premium.png"
              alt="Premium Logo"
              className="h-6 w-6 mr-2"
            />
            {user.premiumMember ? "Premium Member"  : "Become Premium"}
          </button>
        <form
          className="flex flex-col items-start mt-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="mobile" className="text-xs font-light">
            Phone Number
          </label>
          <input
            id="mobile"
            type="tel"
            className="h-12 w-full border border-gray-300 rounded-md p-3 mt-1 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your phone number"
            defaultValue={user.phone}
            {...register('phone', {
              required: 'Phone is required',
              minLength: {
                value: 10,
                message: 'Phone must be at least 10 characters long',
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-600 text-xs">{errors.phone.message}</p>
          )}

          <label htmlFor="address" className="text-xs font-light mt-4">
            Address
          </label>
          <input
            id="address"
            type="text"
            className="h-16 w-full border border-gray-300 rounded-md p-3 mt-1 placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your address"
            defaultValue={user.address}
            {...register('address', {
              required: 'Address is required',
              minLength: {
                value: 10,
                message: 'Address must be at least 10 characters long',
              },
              validate: (value: string) => {
                if (!value.trim()) {
                  return 'Address cannot be empty';
                }
                return true;
              },
            })}
          />
          {errors.address && (
            <p className="text-red-600 text-xs">{errors.address.message}</p>
          )}

          <button
            type="submit"
            className="h-12 p-3 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-500 transition-colors"
          >
            Submit
          </button>
          <input
            onChange={fileChangeHandler}
            ref={fileRef}
            type="file"
            className="hidden"
          />
        </form>
      </div>
      <ToastContainer />
      {
        premiumdialog && (
          <PremiumDialog dialogRef={premiumDialogRef} closeHandler={closePremiumHandler}/>
        )
      }
    </div>
  );
}
