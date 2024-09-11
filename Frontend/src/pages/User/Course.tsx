import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import url from "../../helper/backendUrl";
import { courseProps } from "../../types/courseProps";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";

export default function Course(): ReactElement {
  const [courses, setCourses] = useState<Array<courseProps>>([]);
  const dispatch=useAppDispatch()
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setPage("course"))
    async function dataWrapper() {
      const response = (
        await axios.get(url + "/user/course", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
      ).data;
      console.log(response);
      setCourses(response.courses);
    }
    dataWrapper();
  }, []);
  const courseNavHandler = () => {
    navigate("/user/roadmap");
  };
  const courseModalHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert("clicked here");
  };
  const favHandler=(e:React.MouseEvent<HTMLImageElement>)=>{
    e.stopPropagation()
    alert("favorite clicked")
  }
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
            <img onClick={favHandler} src="/course/favorite.png" className="h-5 w-5" />
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
    </div>
  );
}
