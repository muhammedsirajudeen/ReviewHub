import { ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import url from '../../helper/backendUrl';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';
import TopBar from '../../components/TopBar';
import { roadmapProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';
import { useAppSelector } from '../../store/hooks';
import axiosInstance from '../../helper/axiosInstance';

export default function Roadmap(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  //when user try to navigate normally just redirect them out

  const [pagecount, setPagecount] = useState<number>(0);
  const [roadmaps, setRoadmaps] = useState<Array<roadmapProps>>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [enroll, setEnroll] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const user=useAppSelector((state)=>state.global.user)
  let lessonCount = 1;

  useEffect(() => {
    if (!location.state) {
      navigate('/user/courses');
      return;
    }
    console.log('loaded');
    async function dataWrapper() {
      let urlconstructor = `/user/roadmap/${location.state.courseId}?page=${currentpage}`;
      if (search)
        urlconstructor = `/user/roadmap/${location.state.courseId}?page=${currentpage}&search=${search}`;
      const response = (
        await axiosInstance.get(urlconstructor)
      ).data;
      console.log(response);
      setRoadmaps(response.roadmaps);
      setPagecount(response.pageLength);
    }
    dataWrapper();

    async function enrolledWrapper() {
      const urlconstructor = `/user/enroll/${location.state.courseId}`;
      const response = (
        await axiosInstance.get(urlconstructor)
      ).data;
      if (response.message === 'success') {
        setEnroll(true);
      }
    }
    enrolledWrapper();
  }, [currentpage, location.state, navigate, search]);

  //in useffect we have to check existing roadmap

  //pagination handleers
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

  const roadmapNavHandler = (roadmap: roadmapProps) => {
    if(user.authorization==="reviewer"){
      navigate('/user/resource', { state: { roadmapId: roadmap._id } });
    }
    // console.log(roadmap)
    if (enroll) {
      navigate('/user/resource', { state: { roadmapId: roadmap._id } });
    } else {
      toast('enroll before seeing the resource');
    }
  };
  const dialogHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert('ellipsis');
  };
  const enrollHandler = async () => {
    const response = (
      await axiosInstance.post(
        `/user/enroll`,
        {
          courseId: location.state.courseId,
        },
      )
    ).data;
    if (response.message === 'success') {
      toast('enrolled successfully');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast(response.message);
    }
  };
  const disenrollHandler = async () => {
    const response = (
      await axiosInstance.delete(`/user/enroll/${location.state.courseId}`)
    ).data;
    if (response.message === 'success') {
      toast('disenrolled successfully');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast(response.message);
    }
  };

  return (
    <>
      <TopBar
        courseId={location.state ? location.state.courseId : ''}
        search={search}
        setSearch={setSearch}
        setRoadmaps={setRoadmaps}
        currentpage={currentpage}
      />
      <FilterBarRoadmap
        type="roadmap"
        currentpage={currentpage}
        courseId={location.state ? location.state.courseId : ''}
        setRoadmaps={setRoadmaps}
      />
      {user.authorization!=="reviewer" 
      && 
      (
        <div className="flex justify-center mt-10">
          {enroll ? (
            <button
              onClick={disenrollHandler}
              className="bg-red-500 p-2 flex items-center rounded-lg shadow hover:bg-red-600 transition duration-300"
            >
              <img className="mr-2" src="/dashboard/school.png" alt="Disenroll" />
              <p className="text-xs text-white font-bold">Disenroll</p>
            </button>
          ) : (
            <button
              onClick={enrollHandler}
              className="bg-green-500 p-2 flex items-center rounded-lg shadow hover:bg-green-600 transition duration-300"
            >
              <img className="mr-2" src="/dashboard/school.png" alt="Enroll" />
              <p className="text-xs text-white font-bold">Enroll</p>
            </button>
          )}
        </div>

      )
      }

      <div className="mt-10 flex justify-evenly flex-wrap">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap._id}
            onClick={() => roadmapNavHandler(roadmap)}
            className="flex h-64 w-72 shadow-lg m-4 items-center justify-center flex-col rounded-lg transition-transform transform hover:scale-105"
          >
            <img
              className="h-28 w-full object-cover rounded-t-lg"
              src={
                roadmap.roadmapImage
                  ? `${url}/roadmap/${roadmap.roadmapImage}`
                  : '/roadmap/roadmapbg.png'
              }
              alt={roadmap.roadmapName}
            />
            <div className="p-2 text-center">
              <p className="text-4xl font-bold">{lessonCount++}</p>
              <p className="text-lg font-light">{roadmap.roadmapName}</p>
            </div>
            <div className="flex justify-end mr-2 w-full">
              <img
                onClick={dialogHandler}
                src="/ellipsis.png"
                className="h-4 w-4 cursor-pointer hover:opacity-75 transition duration-300"
                alt="More Options"
              />
            </div>
            <p className="text-center text-xs mt-2 font-light px-4">
              {roadmap.roadmapDescription}
            </p>
          </div>
        ))}
      </div>

      <div className="fixed left-1/2 bottom-10 transform -translate-x-1/2 w-screen flex justify-center">
        <div className="flex items-center justify-evenly w-1/2">
          <button
            onClick={previouspageHandler}
            className="flex h-8 items-center justify-center hover:bg-gray-200 rounded-lg p-1 transition duration-300"
          >
            <img src="/course/prev.png" className="h-6" alt="Previous" />
          </button>
          {pageHandler(pagecount).map((page) => (
            <button
              key={page}
              className={`border border-gray-300 p-2 rounded-lg h-8 flex items-center justify-center text-xs ${
                currentpage === page ? 'bg-black text-white' : 'text-gray-700'
              } hover:bg-gray-200 transition duration-300`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={nextpageHandler}
            className="flex h-8 items-center justify-center hover:bg-gray-200 rounded-lg p-1 transition duration-300"
          >
            <img src="/course/next.png" className="h-6" alt="Next" />
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
