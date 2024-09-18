import { ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import url from '../../helper/backendUrl';
import axios from 'axios';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';
import TopBar from '../../components/TopBar';
import { roadmapProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';

export default function Roadmap(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  //when user try to navigate normally just redirect them out

  const [pagecount, setPagecount] = useState<number>(0);
  const [roadmaps, setRoadmaps] = useState<Array<roadmapProps>>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [enroll, setEnroll] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  let lessonCount = 1;

  useEffect(() => {
    if (!location.state) {
      navigate('/user/courses');
      return;
    }
    console.log('loaded');
    async function dataWrapper() {
      let urlconstructor = `${url}/user/roadmap/${location.state.courseId}?page=${currentpage}`;
      if (search)
        urlconstructor = `${url}/user/roadmap/${location.state.courseId}?page=${currentpage}&search=${search}`;
      const response = (
        await axios.get(urlconstructor, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        })
      ).data;
      console.log(response);
      setRoadmaps(response.roadmaps);
      setPagecount(response.pageLength);
    }
    dataWrapper();

    async function enrolledWrapper() {
      const urlconstructor = `${url}/user/enroll/${location.state.courseId}`;
      const response = (
        await axios.get(urlconstructor, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        })
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
      await axios.post(
        `${url}/user/enroll`,
        {
          courseId: location.state.courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        }
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
      await axios.delete(`${url}/user/enroll/${location.state.courseId}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      })
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
      {enroll ? (
        <button
          onClick={disenrollHandler}
          className=" ml-64 bg-red-500 p-2 flex justify-evenly items-center mt-10"
        >
          <img className="mr-2" src="/dashboard/school.png" />
          <p className="text-xs text-white font-bold">Disenroll</p>
        </button>
      ) : (
        <button
          onClick={enrollHandler}
          className=" ml-64 bg-green-500 p-2 flex justify-evenly items-center mt-10"
        >
          <img className="mr-2" src="/dashboard/school.png" />
          <p className="text-xs text-white font-bold">Enroll</p>
        </button>
      )}
      <div className="ml-36 mt-10 flex justify-evenly flex-wrap">
        {roadmaps.map((roadmap) => {
          return (
            <div
              key={roadmap._id}
              onClick={() => roadmapNavHandler(roadmap)}
              className="flex h-64 w-72 shadow-xl m-0 items-center justify-center flex-col"
            >
              <img
                className="h-28 w-full"
                src={
                  roadmap.roadmapImage
                    ? `${url}/roadmap/${roadmap.roadmapImage}`
                    : '/roadmap/roadmapbg.png'
                }
              />

              <p className="text-start w-full ml-10 text-4xl font-bold">
                {lessonCount++}
                <span className="text-lg ml-10 font-light align-middle">
                  {roadmap.roadmapName}
                </span>
              </p>

              <div className="flex justify-end mr-10 w-full">
                <img
                  onClick={dialogHandler}
                  src="/ellipsis.png"
                  className="h-3 w-3"
                />
              </div>
              <p className="text-center text-xs mt-4 font-light">
                {roadmap.roadmapDescription}
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
                    currentpage === page ? 'bg-black text-white' : ''
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
      <ToastContainer />
    </>
  );
}
