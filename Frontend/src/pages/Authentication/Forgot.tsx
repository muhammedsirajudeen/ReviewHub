import { ReactElement } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { passwordStrength } from "check-password-strength";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../helper/axiosInstance";
import { AuthPath } from "../../types/pathNames";

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
    const email = window.localStorage.getItem("email");
    try{
      const response = (await axiosInstance.post(
        `/auth/password?id=${searchParams.get("token")}`,
        {
          password: data.password,
          email: email,
        }
      )).data;
  
      if (response.message === "success") {
        toast("Password Changed Successfully");
        
        setTimeout(() => navigate(AuthPath.signin), 1000);
      } else {
        toast(response.message);
      }
    }catch(error){
      console.log(error)
      toast("error changing password")
    }
  };

  return (
    <>

      <img src="login/loginperson.png" className="absolute left-1/4 top-0 -z-10" />
      <div className="flex items-center justify-center min-h-screen ">

        <div className="bg-white rounded-lg shadow-lg p-8 w-96 flex flex-col">
          <h1 className="text-2xl font-semibold text-center mb-6">ReviewHub</h1>
          <h1 className="text-xs font-semibold text-center mb-6">Forgot Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <input
              className="h-12 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter new password"
              type="password"
              {...register("password", {
                required: { value: true, message: "Please enter a password" },
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                validate: (password) => {
                  if (password.trim() === "") {
                    return "Password cannot be empty";
                  }
                  const strength = passwordStrength(password).value;
                  if (strength === "Weak") {
                    return "Enter a strong password";
                  }
                  return true;
                },
              })}
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

            <input
              type="password"
              className="h-12 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: { value: true, message: "Please confirm your password" },
                validate: (confirmPassword) => {
                  if (confirmPassword !== watch("password")) {
                    return "Passwords do not match";
                  }
                  return true;
                },
              })}
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}

            <button
              type="submit"
              className="bg-gray-600 text-white h-12 rounded-md transition hover:bg-blue-700 focus:outline-none"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() => navigate(AuthPath.signin)}
              className="border border-gray-300 text-gray-600 h-12 rounded-md transition hover:bg-gray-200"
            >
              Back to Login
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
