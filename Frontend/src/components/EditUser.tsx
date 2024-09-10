import axios, { AxiosError } from "axios";
import {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
  useRef,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import url from "../helper/backendUrl";
import userProps from "../types/userProps";
interface FormValues {
  email: string;
  password: string;
  phone: string;
  address: string;
}

export default function EditUser({
  editstate,
  setEditstate,
  user,
}: {
  editstate: boolean;
  setEditstate: Dispatch<SetStateAction<boolean>>;
  user?: userProps;
}): ReactElement {
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phone: user?.phone,
      email: user?.email,
      address: user?.address,
    },
  });

  const filechangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (e.target.files[0].size > maxSize) {
        // errorSpan.textContent = 'File size exceeds 2MB.';
        // isValid = false;
        toast("must be less than 2MB");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        toast("invalid file type");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageRef.current) {
          imageRef.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // const imageFile = imageRef.current?.src;
    console.log(data.email);
    const formData = new FormData();
    if (user?.email) {
      formData.append("currentemail", user?.email ?? "");
    }
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    if (fileRef.current?.files) {
      formData.append("file", fileRef.current.files[0]);
    }
    try{
      const response = (
        await axios.put(url + "/admin/user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
      ).data;
      console.log(response)
      if (response.message === "success") {
        toast("edited successfuly");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast(response.message);
        setTimeout(() => window.location.reload(), 1000);

      }
  
    }catch(error){
      if(error instanceof AxiosError){
        console.log(error)
        toast(error.message)
  
      }
    }
  };
  return (
    <dialog
      className="h-auto p-4 flex items-center justify-start flex-col w-96 shadow-2xl mt-20 rounded-sm"
      open={editstate}
    >
      <button
        className="text-xs font-bold mt-10"
        onClick={() => setEditstate(false)}
      >
        x
      </button>
      <p className="text-xs mt-6">EDIT</p>
      <img
        ref={imageRef}
        src={user?.profileImage ?? "user.png"}
        className="rounded-full w-28 h-28 mt-2"
        onClick={() => fileRef.current?.click()}
      />
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="text-xs mt-5">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
          placeholder="enter the email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
        <label htmlFor="password" className="text-xs mt-5">
          Mobile
        </label>
        <input
          id="mobile"
          type="number"
          className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
          placeholder="enter the password"
          {...register("phone", {
            required: "Phone Number is required",
            minLength: {
              value: 10,
              message: "Phone number must be 10 characters long ",
            },
          })}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
        <label htmlFor="address" className="text-xs mt-5">
          Address
        </label>
        <input
          id="address"
          type="text"
          className="h-8 w-72 border border-black rounded-sm placeholder:text-xs"
          placeholder="enter the password"
          {...register("address", {
            required: "Address is required",
            minLength: {
              value: 10,
              message: "Address must be alteast 10 characters long ",
            },
            validate: (address: string) => {
              if (address.trim() === "") return "address cannot be empty";
              return true;
            },
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
        <input
          ref={fileRef}
          onChange={filechangeHandler}
          type="file"
          className="hidden"
        />
        <button
          type="submit"
          className="h-10 w-72 bg-signin-button mt-5 text-white text-xs flex items-center justify-center"
        >
          EDIT
        </button>
      </form>
      <ToastContainer />
    </dialog>
  );
}
