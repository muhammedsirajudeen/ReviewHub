import { ReactElement, useEffect, useState } from "react";
import { courseProps } from "../../types/courseProps";
import axiosInstance from "../../helper/axiosInstance";
import url from "../../helper/backendUrl";
import PaginationComponent from "../../components/pagination/PaginationComponent";

export default function ManageCourse(): ReactElement {
    const [enrolled, setEnrolled] = useState<courseProps[]>([]);
    const [currentpage, setCurrentpage] = useState<number>(1);
    const [pagecount, setPagecount] = useState<number>(0);
    useEffect(() => {
        async function dataWrapper() {
            try {
                const response = (await axiosInstance.get(`/user/enroll?progress=true&page=${currentpage}`)).data;
                if (response.message === "success") {
                    setEnrolled(response.enrolledCourses);
                    setPagecount(response.pageLength)
                } else {
                    console.log(response.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        dataWrapper();
    }, []);
    const pageHandler = (count: number) => {
        const page = Math.ceil(count / 10) + 1;
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
        if (next > Math.ceil(pagecount / 10) + 1) {
          setCurrentpage(Math.ceil(pagecount / 10) + 1);
          return;
        }
        setCurrentpage(next);
      };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-start mb-6 ">Your Progress</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-20 lg:grid-cols-3 gap-6">
                {enrolled.map((course) => (
                    <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:scale-105">
                        <img className="w-96 h-40 object-cover" src={`${url}/course/${course.courseImage}`} alt={course.courseName} />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">{course.courseName}</h2>
                            <p className="text-gray-600 mb-2">{course.courseDescription}</p>
                            <p className="text-gray-500 text-sm">{new Date(course.postedDate).toLocaleDateString()}</p>
                            <p className="text-gray-500 text-sm italic">{course.domain}</p>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationComponent
          previouspageHandler={previouspageHandler}
          nextpageHandler={nextpageHandler}
          pageHandler={pageHandler}
          pagecount={pagecount}
          currentpage={currentpage}
        />
        </div>
    );
}
