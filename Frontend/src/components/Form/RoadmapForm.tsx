import {  ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";

interface Inputs {
  courseName: string;
  courseDescription: string;

}

//for now keep it static add an option to accept it from the user as well

export default function RoadmapForm({
  closeForm,
  id
}: {
  closeForm: VoidFunction,
  id:string
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>();


  // form submission Handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data,id)
  };

  return (
    <form
      className="flex flex-col items-center justify-start w-3/4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* input forms here */}
      <p className="text-2xl font-light mt-4">ADD ROADMAP</p>
      <p className="text-xs font-light text-start w-full mt-4">Name</p>

      <input
        placeholder="enter the Roadmap Heading"
        className="h-8 w-full border border-black placeholder:text-xs "
        {...register("courseName", {
          required: {
            value: true,
            message: "please enter the Course Name",
          },
          minLength: {
            value: 5,
            message: "please enter alteast 8 character",
          },
          validate: (courseName: string) => {
            if (courseName.trim() === "") return "please enter the Course Name";
            if (SpecialCharRegex.test(courseName))
              return "please enter valid Character";
            return true;
          },
        })}
      />
      {errors.courseName && (
        <span className="text-xs text-red-500">
          {errors.courseName.message}
        </span>
      )}
      <p className="text-xs font-light text-start w-full mt-4">Description</p>
      {/* for course Description */}
      <input
        placeholder="enter the Roadmap Description"
        className="h-8 w-full border border-black placeholder:text-xs"
        {...register("courseDescription", {
          required: {
            value: true,
            message: "please enter the Course Desription",
          },
          minLength: {
            value: 5,
            message: "please enter alteast 8 character",
          },
          validate: (courseDescription: string) => {
            if (courseDescription.trim() === "")
              return "please enter the Course Name";
            if (SpecialCharRegex.test(courseDescription))
              return "please enter valid Character";
            return true;
          },
        })}
      />
      {errors.courseDescription && (
        <span className="text-xs text-red-500">
          {errors.courseDescription.message}
        </span>
      )}
      {/* for course Category*/}






      <div className="flex items-center justify-start w-full mt-5">
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white  ml-2 h-6 text-xs flex items-center justify-center"
        >
          submit
        </button>
        <button
          onClick={closeForm}
          type="button"
          className="bg-white p-2 text-black border border-black ml-2 h-6 text-xs flex items-center justify-center"
        >
          Cancel
        </button>
      </div>
      <ToastContainer />
    </form>
  );
}
