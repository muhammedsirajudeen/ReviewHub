import { ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import url from '../../helper/backendUrl';
import axios from 'axios';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';
import TopBar from '../../components/TopBar';
import { roadmapProps } from '../../types/courseProps';

export default function Roadmap(): ReactElement {
  const location = useLocation();
  const [pagecount, setPagecount] = useState<number>(0);
  const [roadmaps, setRoadmaps] = useState<Array<roadmapProps>>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();
  useEffect(() => {
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
  }, [currentpage, location.state, location.state.courseId, search]);

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
    navigate('/user/chapter', { state: { roadmapId: roadmap._id } });
  };
  const dialogHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    alert('ellipsis');
  };

  return (
    <>
      <TopBar
        courseId={location.state.courseId}
        search={search}
        setSearch={setSearch}
        setRoadmaps={setRoadmaps}
        currentpage={currentpage}
      />
      <FilterBarRoadmap
        type="roadmap"
        currentpage={currentpage}
        courseId={location.state.courseId as string}
        setRoadmaps={setRoadmaps}
      />

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
                {roadmap.lessonCount}
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
    </>
  );
}
