import { ReactElement } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { passwordStrength } from "check-password-strength";
import { useNavigate } from "react-router";
import axios from "axios";
import url from "../../helper/backendUrl";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

type Inputs = {
  password: string;
  confirmPassword: string;
};
export default function Forgot(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const email = window.localStorage.getItem("email");
    console.log(email)
    const response = (await axios.post(
      `${url}/auth/password?id=${searchParams.get("token")}`,
      {
        password: data.password,
        email: email,
      }
    )).data;
    if(response.message==="success"){
        toast("success")
    }else{
        toast(response.message)
    }
  };
  return (
    <div className="flex items-center justify-center mt-72">
      <div className="flex w-96 h-auto p-10 shadow-2xl items-center justify-center flex-col ">
        <h1 className="text-xl font-light text-center">Reset Password?</h1>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className="h-8 mt-10 w-80 border border-gray-500 placeholder:text-xs"
            placeholder="enter the password"
            type="password"
            {...register("password", {
              required: { value: true, message: "please enter the password" },
              minLength: {
                value: 8,
                message: "password should be atleast 8 characters",
              },

              validate: (password) => {
                if (password.trim() === "") {
                  return "password cannot be empty";
                } else {
                  const strength = passwordStrength(password).value;
                  console.log(strength);
                  if (strength === "Weak") {
                    return "Enter a strong password";
                  } else {
                    return true;
                  }
                }
              },
            })}
          />

          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}

          <input
            type="password"
            className="h-8 mt-10 w-full border border-gray-500 placeholder:text-xs"
            placeholder="confirm the entered password"
            {...register("confirmPassword", {
              required: { value: true, message: "please enter the password" },
              minLength: {
                value: 8,
                message: "please enter minimum character",
              },
              validate: (confirmPassword) => {
                if (confirmPassword.trim() === "") {
                  return "password cannot be empty";
                } else {
                  // console.log(watch("password"))
                  if (confirmPassword !== watch("password")) {
                    return "password should match";
                  } else {
                    return true;
                  }
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
          <input
            type="submit"
            className="bg-gray-500 text-white p-2 font-light mt-8 w-full"
          />
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="bg-white border border-black p-2 font-light mt-8 w-full"
          >
            Back To Login
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}
