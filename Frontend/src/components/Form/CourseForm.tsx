import axios from "axios";
import { ChangeEvent, ReactElement, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import url from "../../helper/backendUrl";
import { courseProps } from "../../types/courseProps";

interface Inputs {
  courseName: string;
  courseDescription: string;
  domain: string;
  tagline: string;
}

//for now keep it static add an option to accept it from the user as well
const options = [
  { value: "Mern", label: "Mern" },
  { value: "Django", label: "Django" },
  { value: "Golang", label: "Golang" },
];



export default function CourseForm({
  closeForm,
  course
}: {
  closeForm: VoidFunction,
  course:courseProps | undefined
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
        courseName:course?.courseName,
        courseDescription:course?.courseDescription,
        domain:course?.domain,
        tagline:course?.tagline

      }
    }
  );
  const [domain,setDomain]=useState("")
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
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
  const imageCloseHandler = () => {
    if (imageRef.current?.src) {
      imageRef.current.src = "/form/add.png";
    }
  };
  // form submission Handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("courseName", data.courseName);
    formData.append("courseDescription", data.courseDescription);
    formData.append("domain", data.domain);
    formData.append("tagline", data.tagline);
    if(course) formData.append("courseId",course._id)
    if(!fileRef.current?.files){
        toast("please select a file")
        return
    }else{
        formData.append("file",fileRef.current.files[0])
    }
    console.log(domain)
    if(!domain){
        toast("please select a domain first")
        return
    }
    if(course){
      
      //here the course is there so we are putting data
      const response = (
        await axios.put(url + "/admin/course", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
      ).data;
      if(response.message==="success"){
          toast("updated successfully")
          setTimeout(()=>window.location.reload(),1000)
      }else{
          toast(response.message)
      }
      return
    }
     const response = (
      await axios.post(url + "/admin/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
    ).data;
    if(response.message==="success"){
        toast("updated successfully")
        setTimeout(()=>window.location.reload(),1000)
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
      <p className="text-2xl font-light mt-4">ADD COURSE</p>
      <p className="text-xs font-light text-start w-full mt-4">Name</p>

      <input
        placeholder="enter the Course Name"
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
        placeholder="enter the Course Description"
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
      <p className="text-xs font-light text-start w-full mt-4">TagLine</p>
      <input
        placeholder="enter the Course Description"
        className="h-8 w-full border border-black placeholder:text-xs"
        {...register("tagline", {
          required: {
            value: true,
            message: "please enter the Tag Line",
          },
          minLength: {
            value: 5,
            message: "please enter alteast 8 character",
          },
          validate: (tagLine: string) => {
            if (tagLine.trim() === "") return "please enter the Course Name";
            if (SpecialCharRegex.test(tagLine))
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
      <p className="text-xs font-light text-start w-full mt-4">Domain</p>
      <Select
        defaultValue={options[0]}
        name="colors"
        options={options}
        className="basic-multi-select"
        onChange={(value)=>setDomain(value?.value ?? "")}
        classNamePrefix="select"
      />
      <input
        onChange={fileHandler}
        ref={fileRef}
        type="file"
        className="hidden"
      />

      <button
        type="button"
        onClick={imageCloseHandler}
        className="flex relative top-8 items-center justify-center font-light bg-red-600 text-white p-2 text-xs rounded-full h-6 w-6 mt-4 mr-24"
      >
        x
      </button>
      <div className="h-32 flex flex-col items-center justify-center w-32 border border-black rounded-lg">
        <img
          onClick={() => fileRef.current?.click()}
          ref={imageRef}
          src={course?.courseImage ? `${url}/course/${course.courseImage}`  :  `/form/add.png`}
          className="h-full w-full rounded-lg"
        />
      </div>
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
