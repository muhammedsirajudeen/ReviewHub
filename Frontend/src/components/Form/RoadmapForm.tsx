import axios from "axios";
import {  ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import url from "../../helper/backendUrl";
import { roadmapProps } from "../../types/courseProps";

interface Inputs {
  roadmapName: string;
  roadmapDescription: string;

}
interface Payload extends Inputs{
  courseId:string;
}

//for now keep it static add an option to accept it from the user as well

export default function RoadmapForm({
  closeForm,
  id,
  roadmap,
  method
}: {
  closeForm: VoidFunction,
  id:string,
  roadmap:roadmapProps | undefined,
  method:string
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>(
    {
      defaultValues:{
        roadmapName:roadmap?.roadmapName,
        roadmapDescription:roadmap?.roadmapDescription,
      }
    }
  );


  // form submission Handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data,id)
    if(method==="put"){
      const response=(
        await axios.put(`${url}/admin/roadmap/${roadmap?._id}`,
          {
            courseId:id,
            roadmapName:data.roadmapName,
            roadmapDescription:data.roadmapDescription
  
          } as Payload,
          {
            headers:{
              Authorization:`Bearer ${window.localStorage.getItem("token")}`
            }
          }
        )
      ).data
      if(response.message==="success"){
        toast("roadmap updated successfully")
        setTimeout(() => window.location.reload(),1000);
      }else{
        toast(response.message)
      }
      return
    }
    const response=(
      await axios.post(url+"/admin/roadmap",
        {
          courseId:id,
          roadmapName:data.roadmapName,
          roadmapDescription:data.roadmapDescription

        } as Payload,
        {
          headers:{
            Authorization:`Bearer ${window.localStorage.getItem("token")}`
          }
        }
      )
    ).data
    if(response.message==="success"){
      toast("roadmap added successfully")
      setTimeout(() => window.location.reload(),1000);
    }else{
      toast(response.message)
    }
    
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
        {...register("roadmapName", {
          required: {
            value: true,
            message: "please enter the Roadmap Name",
          },
          minLength: {
            value: 5,
            message: "please enter alteast 8 character",
          },
          validate: (roadmapName: string) => {
            if (roadmapName.trim() === "") return "please enter the roadmap Name";
            if (SpecialCharRegex.test(roadmapName))
              return "please enter valid Character";
            return true;
          },
        })}
      />
      {errors.roadmapName && (
        <span className="text-xs text-red-500">
          {errors.roadmapName.message}
        </span>
      )}
      <p className="text-xs font-light text-start w-full mt-4">Description</p>
      {/* for roadmap Description */}
      <input
        placeholder="enter the Roadmap Description"
        className="h-8 w-full border border-black placeholder:text-xs"
        {...register("roadmapDescription", {
          required: {
            value: true,
            message: "please enter the roadmap Desription",
          },
          minLength: {
            value: 5,
            message: "please enter alteast 8 character",
          },
          validate: (roadmapDescription: string) => {
            if (roadmapDescription.trim() === "")
              return "please enter the roadmap Name";
            if (SpecialCharRegex.test(roadmapDescription))
              return "please enter valid Character";
            return true;
          },
        })}
      />
      {errors.roadmapDescription && (
        <span className="text-xs text-red-500">
          {errors.roadmapDescription.message}
        </span>
      )}
      {/* for roadmap Category*/}
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
