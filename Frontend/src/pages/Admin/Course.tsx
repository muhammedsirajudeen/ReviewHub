import { ReactElement, useEffect, useRef, useState } from "react";
import CourseForm from "../../components/Form/CourseForm";
import { flushSync } from "react-dom";
import axios from "axios";
import url from "../../helper/backendUrl";

interface courseProps{
    _id:string,
    courseName:string,
    courseDescription:string,
    domain:string,
    courseImage:string,
    tagline:string
}

export default function Course(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [courses,setCourses]=useState<Array<courseProps>>([])
  const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(()=>{
        async function dataWrapper(){
            const response=(await axios.get(url+"/user/course",{
                headers:{
                    Authorization:`Bearer ${window.localStorage.getItem("token")}`
                }
            })).data
            console.log(response)
            setCourses(response.courses)
        }
        dataWrapper()
    },[])
  const openForm = () => {
    //ensuring state is updated before accessing the dom
    flushSync(()=>{
        setOpen(true);
    })
    dialogRef.current?.showModal();


  };
  const closeForm = () => {
    setOpen(false);
    dialogRef.current?.close();
  };

  return (
    <>
    
      <div className="ml-36 mt-10 flex items-center justify-evenly">
        {courses.map((course)=>{
            return(
                <p key={course._id} >{course.courseName}</p>
            )
        })}
        <div className="flex h-72 w-80 shadow-xl items-center flex-col justify-center">
          <button
            onClick={openForm}
            style={{ fontSize: "4vw" }}
            className="flex items-center justify-center text-4xl font-light rounded-lg"
          >
            +
          </button>
          <p className="text-sm mt-10 text-gray-500">Add more Courses...</p>
        </div>
      </div>
      {open && (
        <dialog
          ref={dialogRef}
          className="flex items-center justify-center flex-col w-96  p-2"
        >
          <CourseForm closeForm={closeForm} />
        </dialog>
      )} 
    </>
  );
}
