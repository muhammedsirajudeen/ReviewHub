import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import url from "../../helper/backendUrl";
import { courseProps } from "../../types/courseProps";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function Course(): ReactElement {
  const [courses, setCourses] = useState<Array<courseProps>>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPage("course"));
    async function dataWrapper() {
      const response = (
        await axios.get(url + `/user/course?page=${currentpage}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
      ).data;
      console.log(response);
      setCourses(response.courses);
      setPagecount(response.pageLength);
    }
    dataWrapper();
  }, [dispatch,currentpage]);
  const courseNavHandler = () => {
    navigate("/user/roadmap");
  };
  const courseModalHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert("clicked here");
  };
  const favHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert("favorite clicked");
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10);
    const array = [];
    for (let i = 0; i < page; i++) {
      array.push(i + 1);
    }
    return array;
  };
  const previouspageHandler = () => {
    const prev = currentpage - 1;
    if (prev <= 0) {
      setCurrentpage(1);
      return;
    }
    setCurrentpage(prev);
  };
  const nextpageHandler = () => {
    const next = currentpage + 1;
    if (next > Math.ceil(pagecount / 10)) {
      setCurrentpage(Math.ceil(pagecount / 10));
      return;
    }
    setCurrentpage(next);
  };
  return (
    <div className="ml-36 flex justify-evenly flex-wrap mt-16">
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
            <div className="flex justify-between w-full">
              <img
                onClick={favHandler}
                src="/course/favorite.png"
                className="h-5 w-5"
              />
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
      <div className="fixed left-1/2 bottom-10  w-screen flex">
        <div className="flex items-center justify-evenly w-32">
          <button
            onClick={previouspageHandler}
            className="flex h-8 items-center justify-center"
          >
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
          <button
            onClick={nextpageHandler}
            className="flex h-8 items-center justify-center"
          >
            <img src="/course/next.png" className="h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
