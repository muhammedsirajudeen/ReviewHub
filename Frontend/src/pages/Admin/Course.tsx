import { ReactElement, useEffect, useRef, useState } from "react";
import CourseForm from "../../components/Form/CourseForm";
import { flushSync } from "react-dom";
import axios from "axios";
import url from "../../helper/backendUrl";
import { useNavigate } from "react-router";
import { courseProps } from "../../types/courseProps";

export default function Course(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Array<courseProps>>([]);
  const [pagecount, setPagecount] = useState<number>(0);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function dataWrapper() {
      const response = (
        await axios.get(url + `/user/course?page=${currentpage}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
      ).data;
      setCourses(response.courses);
      setPagecount(response.pageLength);
    }
    dataWrapper();
  }, [currentpage]);
  const openForm = () => {
    //ensuring state is updated before accessing the dom
    flushSync(() => {
      setOpen(true);
    });
    dialogRef.current?.showModal();
  };
  const closeForm = () => {
    setOpen(false);
    dialogRef.current?.close();
  };
  const courseNavHandler = () => {
    navigate("/admin/roadmap");
  };
  const courseModalHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert("clicked here");
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10);
    const array = [];
    for (let i = 0; i < page; i++) {
      array.push(i + 1);
    }
    return array;
  };
  const previouspageHandler=()=>{
    const prev=currentpage-1
    if(prev<=0){
      setCurrentpage(1)
      return
    }
    setCurrentpage(prev)
  }
  const nextpageHandler=()=>{
    const next=currentpage+1
    if(next>Math.ceil(pagecount / 10)){
      setCurrentpage(Math.ceil(pagecount / 10))
      return
    }
    setCurrentpage(next)
    
  }

  return (
    <>
      <div className="ml-36 mt-10 flex items-center justify-evenly flex-wrap ">
        {courses.map((course) => {
          return (
            <div
              key={course._id}
              onClick={courseNavHandler}
              className="flex h-72 w-80 shadow-xl items-center justify-center flex-col"
            >
              <img
                className="w-full h-40"
                src={`${url}/course/${course.courseImage}`}
              />
              <div className="flex justify-end w-full">
                <img
                  onClick={(e) => courseModalHandler(e)}
                  src="/ellipsis.png"
                  className="h-3 w-3"
                />
              </div>
              <p className="text-center text-2xl font-light">
                {course.courseName}
              </p>
              <p className="text-center text-xs font-light">
                {course.courseDescription}
              </p>
            </div>
          );
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
      <div className="fixed left-1/2 bottom-10  w-screen flex">
        <div className="flex items-center justify-evenly w-32">
          <button onClick={previouspageHandler} className="flex h-8 items-center justify-center">
            <img src="/course/prev.png" className="h-6" />
          </button>
          {pageHandler(pagecount).map((page) => {
            return (
              <button
                key={page}
                className={`border border-black p-2 rounded-xl h-8 flex items-center justify-center text-xs ${
                  currentpage === page ? "bg-black text-white" : ""
                } `}
              >
                {page}
              </button>
            );
          })}
          <button onClick={nextpageHandler} className="flex h-8 items-center justify-center">
            <img src="/course/next.png" className="h-6" />
          </button>
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
