import { ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import RoadmapForm from '../../components/Form/RoadmapForm';
import { flushSync } from 'react-dom';
import url from '../../helper/backendUrl';
import RoadmapDeleteForm from '../../components/Form/RoadmapDelete.form';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';
import TopBar from '../../components/TopBar';
import { roadmapProps } from '../../types/courseProps';
import axiosInstance from '../../helper/axiosInstance';
import { ToastContainer } from 'react-toastify';



export default function Roadmap(): ReactElement {
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false);
    const [editopen,setEditopen]=useState<boolean>(false)
    const [deleteopen,setDeleteopen]=useState<boolean>(false)
    const [pagecount, setPagecount] = useState<number>(0);
    const [roadmaps, setRoadmaps] = useState<Array<roadmapProps>>([]);
    const [roadmap,setRoadmap]=useState<roadmapProps>()
    const [currentpage, setCurrentpage] = useState<number>(1);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const deletedialogRef=useRef<HTMLDialogElement>(null)
    const [search,setSearch]=useState<string>("")
    const navigate=useNavigate()
    let lessonCount=1
    useEffect(() => {
        async function dataWrapper() {
          let urlconstructor=`/user/roadmap/${location.state.id}?page=${currentpage}`
          if(search){
            urlconstructor=`/user/roadmap/${location.state.id}?page=${currentpage}&search=${search}`
          }
            const response = (
                await axiosInstance.get(
                    urlconstructor,
                )
            ).data;
            console.log(response)
            setRoadmaps(response.roadmaps);
            setPagecount(response.pageLength);
        }
        dataWrapper();
    }, [currentpage, location.state.id,search]);

    const formHandler = () => {
        flushSync(() => {
            setOpen(true);
        });
        dialogRef.current?.showModal();
    };
    const closeForm = () => {
        dialogRef.current?.close();
        setOpen(false);

    };
    const editCloseForm=()=>{
      dialogRef.current?.close()
      setEditopen(false)
    }
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

    const roadmapNavHandler=(roadmap:roadmapProps)=>{
        console.log(roadmap)
        navigate('/admin/chapter',{state:{roadmap:roadmap}})
        
    }
    const dialogHandler=(e:React.MouseEvent<HTMLImageElement>)=>{
      e.stopPropagation()
      alert("ellipsis")
    }
    const deleteModalHandler=(roadmap:roadmapProps)=>{
        // console.log(roadmap)
        setRoadmap(roadmap)
        flushSync(()=>{
            setDeleteopen(true)
        })
        deletedialogRef.current?.showModal()
    }
    const editModalHandler=(roadmap:roadmapProps)=>{
        setRoadmap(roadmap)
        flushSync(()=>{
            setEditopen(true)
        })
        dialogRef.current?.showModal()

    }
    const closeDeleteHandler=()=>{
        deletedialogRef.current?.close()
        setDeleteopen(false)
    }

    return (
      <>
        <TopBar courseId={location.state.id} search={search} currentpage={currentpage} setSearch={setSearch} setRoadmaps={setRoadmaps} />
        <FilterBarRoadmap type='roadmap' currentpage={currentpage} courseId={location.state.id as string}  setRoadmaps={setRoadmaps} />
        <div className="ml-36 mt-10 flex justify-evenly flex-wrap">
          {roadmaps.map((roadmap) => {
            return (
              <div
                key={roadmap._id}
                onClick={() => roadmapNavHandler(roadmap)}
                className={`${roadmap.unlistStatus ? "bg-gray-200" : ""} hover:bg-gray-200 flex h-64 w-72 shadow-xl m-0 items-center justify-center flex-col p-4`}
              >
                <img className='h-28 w-full rounded-lg' src={roadmap.roadmapImage ? `${url}/roadmap/${roadmap.roadmapImage}`  :"/roadmap/roadmapbg.png"} />

                <p className="text-start w-full ml-10 text-4xl font-bold">
                  {lessonCount++}
                  <span className={`text-lg ml-10 font-light align-middle ${roadmap.unlistStatus ? "line-through" : ""} `}>
                    {roadmap.roadmapName}
                  </span>
                </p>

                <div className="flex justify-end mr-10 w-full">
                  <div className="flex items-center justify-end w-full mt-2 ">
                    <img
                      onClick={dialogHandler}
                      src="/ellipsis.png"
                      className="h-3 w-3 m-2"
                    />

                    <img
                      className="h-4 w-4 m-2"
                      src="/chapter/delete.png"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModalHandler(roadmap);
                      }}
                    />
                    <img
                      className="h-4 w-4 m-2"
                      src="/course/edit.png"
                      onClick={(e) => {
                        e.stopPropagation();
                        editModalHandler(roadmap);
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-xs mt-4 font-light mb-4">
                  {roadmap.roadmapDescription}
                </p>
              </div>
            );
          })}
          <div className="flex h-64 w-72 shadow-xl items-center flex-col justify-center">
            <button
              onClick={formHandler}
              style={{ fontSize: '4vw' }}
              className="flex items-center justify-center text-4xl font-light rounded-lg"
            >
              +
            </button>
            <p className="text-sm mt-10 text-gray-500">Add Roadmap...</p>
          </div>
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
          {/* dont forget to refactor this into a single component 
              There are similiar patterns in other place consolidate to single component
          */}
          {open && (
            <dialog
              ref={dialogRef}
              className="flex items-center justify-center flex-col w-96  p-2"
            >
              <RoadmapForm
              setRoadmaps={setRoadmaps}
                roadmap={roadmap}
                method="post"
                id={location.state.id}
                closeForm={closeForm}
              />
            </dialog>
          )}
          {editopen && (
            <dialog
              ref={dialogRef}
              className="flex items-center justify-center flex-col w-96  p-2"
            >
              <RoadmapForm
              setRoadmaps={setRoadmaps}
                roadmap={roadmap}
                method="put"
                id={location.state.id}
                closeForm={editCloseForm}
              />
            </dialog>
          )}
          {deleteopen && (
            <RoadmapDeleteForm
              deletedialogRef={deletedialogRef}
              closeDeleteHandler={closeDeleteHandler}
              roadmap={roadmap}
            />
          )}
        <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
        </div>
      </>
    );
}
