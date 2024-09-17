import { ReactElement, useEffect, useRef, useState } from 'react';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { chapterProps, roadmapProps } from '../../types/courseProps';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { flushSync } from 'react-dom';
import ChapterForm from '../../components/Form/ChapterForm';
import ChapterDelete from '../../components/Form/ChapterDelete';
import TopBar from '../../components/TopBar';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';

type Inputs = {
    chapterName: string;
};

export default function Chapter(): ReactElement {
    const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
    const [currentpage,setCurrentpage]=useState<number>(1)
    const [pagecount,setPagecount]=useState<number>(0)
    const [chapters,setChapters]=useState<Array<chapterProps>>([])
    const [chapter,setChapter]=useState<chapterProps>()
    const [open,setOpen]=useState<boolean>(false)
    const [deleteopen,setDeleteopen]=useState<boolean>(false)
    const dialogRef=useRef<HTMLDialogElement>(null)
    const deletedialogRef=useRef<HTMLDialogElement>(null)
    const [search,setSearch]=useState<string>("")
    //giving the method here and setting it explicitly
    const [method,setMethod]=useState<string>("")
    const [chaptername,setChaptername]=useState<string>("")
    const { roadmap }: { roadmap: roadmapProps } = useLocation().state;
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm<Inputs>();

    useEffect(() => {
        async function dataWrapper() {
            let urlconstructor=`${url}/admin/chapter/${roadmap._id}?page=${currentpage}`
            if(search) urlconstructor=`${url}/admin/chapter/${roadmap._id}?page=${currentpage}&search=${search}`
            const response = (
                await axios.get(
                        urlconstructor,
                    {
                        headers: {
                            Authorization: `Bearer ${window.localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
            ).data;
            console.log(response)
            if(response.message==="success"){
                setChapters(response.chapters);
                setPagecount(response.pageLength);
            }else{
                setChapters([])
            }
        }
        dataWrapper();
    }, [currentpage, roadmap._id, search]);


    const onSubmit: SubmitHandler<Inputs> = async (data) =>{
        // console.log(data)
        setChaptername(data.chapterName)
        setMethod("post")
        //synchronously updating the state special case
        //fyi can hurt bit of perfomance
        flushSync(()=>{
            setOpen(true)

            setChapter(undefined)

        })
        dialogRef.current?.showModal()

    };
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
    const editModalHandler=(chapter:chapterProps)=>{
        setMethod('put')
        setChapter(chapter)
        flushSync(()=>{
            setOpen(true)
        })
        dialogRef.current?.showModal()
    }
    const closeForm=()=>{
        dialogRef.current?.close()
        setOpen(false)
    }
    const deleteModalHandler=(chapter:chapterProps)=>{
        setChapter(chapter)
        flushSync(()=>{
            setDeleteopen(true)
        })
        deletedialogRef.current?.showModal()
        
    }
    const closedeleteForm=()=>{
        deletedialogRef.current?.close()
        setDeleteopen(false)
        
    }


    return (
        <>
            <TopBar search={search} setSearch={setSearch} setChapters={setChapters} currentpage={currentpage} roadmapId={roadmap._id}/>
            <FilterBarRoadmap type='chapter' currentpage={currentpage} roadmapId={roadmap._id} setChapters={setChapters}  />
            <div className="ml-36 mt-10 flex flex-col">
                <div className="flex items-center justify-between">
                    {/* placeholder to see which course they are editing */}
                    <div
                        key={roadmap._id}
                        className="flex h-64 w-72 shadow-xl m-0 items-center justify-center flex-col"
                    >
                        <img className='h-32 w-full' src={roadmap.roadmapImage ? `${url}/roadmap/${roadmap.roadmapImage}` : `/roadmap/roadmapbg.png`} />

                        <p className="text-start w-full ml-10 text-4xl font-bold">
                            {roadmap.lessonCount}
                            <span className="text-lg ml-10 font-light align-middle">
                                {roadmap.roadmapName}
                            </span>
                        </p>

                        <div className="flex justify-end mr-10 w-full"></div>
                        <p className="text-center text-xs mt-4 font-light">
                            {roadmap.roadmapDescription}
                        </p>
                    </div>
                    {/* add tag fields here */}
                    <div className="flex h-40 w-98 bg-chapter mr-40 items-start justify-center rounded-2xl">
                        <div className="flex items-center justify-start">
                            <form
                                className="flex items-center flex-col justify-center"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="flex items-center justify-center">
                                    <input
                                        className="h-8 w-full m-4 bg-chapter placeholder:text-white text-white"
                                        type="text"
                                        placeholder="enter the chapter name"
                                        // readOnly={editable}
                                        {...register('chapterName', {
                                            required: {
                                                value: true,
                                                message: 'please enter the chapter',
                                            },
                                            minLength: {
                                                value: 5,
                                                message:
                                                    'please enter the required characters',
                                            },
                                            validate: (tag: string) => {
                                                if (tag.trim() === '')
                                                    return 'please enter the roadmap Name';
                                                if (SpecialCharRegex.test(tag))
                                                    return 'please enter valid Character';
                                                return true;
                                            },
                                        })}
                                    />

                                    <button
                                        className="bg-chapter-light h-6 w-6 flex items-center justify-center mr-4 rounded-xl"
                                        type="button"
                                    >
                                        <img src="/chapter/edit.png" />
                                    </button>
                                </div>
                                <hr className="text-gray-400 w-3/4 " />
                                {errors.chapterName && (
                                    <span className="text-red-500 text-xs">
                                        {errors.chapterName.message}
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className="border border-white  p-1 rounded-lg text-white flex items-center justify-evenly mt-10 mb-4"
                                >
                                    <span className="font-bold text-xl mr-4">
                                        +
                                    </span>
                                    <span className="font-light">Create</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* here the content thats already there is displayed and things like that*/}
                <div className="flex items-center w-screen justify-center flex-col ">
                    {/* adjusting by 36 to right */}
                    <div className="h-14 w-3/4 bg-chapter mt-20 mr-36 flex items-start justify-center flex-col">
                        <h1 className="text-gray-400 font-light text-xl align-middle ml-2 ">
                            {roadmap.roadmapName}
                        </h1>
                    </div>
                    {/* here we create that stuff */}
                    <div className='flex items-center justify-center flex-wrap  w-3/4'>
                        
                    {
                        chapters.map((chapter)=>{
                            return(
                                <div key={chapter._id} className="flex h-20 mt-12 w-72 bg-chapter mr-40 items-start justify-center rounded-2xl  ">
                                <div className="flex items-center justify-center ">
                                    <input
                                        className="h-8 w-full m-4 bg-chapter placeholder:text-white text-white placeholder:text-xs"
                                        type="text"
                                        placeholder="enter the tag"
                                        value={chapter.chapterName}
                                        readOnly
                                        // readOnly={editable}
                                    />
            
                                    <button
                                        className="bg-chapter-light h-6 w-6 flex items-center justify-center mr-4 rounded-xl"
                                        type="button"
                                        onClick={()=>editModalHandler(chapter)}
                                    >
                                        <img onClick={()=>console.log(chapter.chapterName)} src="/chapter/edit.png" />
                                    </button>
                                    <button
                                        className="bg-chapter-light h-6 w-6 flex items-center justify-center mr-4 rounded-xl"
                                        type="button"
                                    >
                                        <img onClick={()=>deleteModalHandler(chapter)} src="/chapter/delete.png" />
                                    </button>
                                    
                                </div>
                            </div>
                            )
                        })
                    }
                    </div>

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
                                        currentpage === page
                                            ? 'bg-black text-white'
                                            : ''
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
                <ToastContainer/>
                {
                    open &&
                    (
                        <ChapterForm roadmapId={roadmap._id} method={method} chapterName={chaptername} chapter={chapter} dialogRef={dialogRef} closeForm={closeForm}/>
                    )
                }
                {
                    deleteopen &&
                    (
                        <ChapterDelete chapter={chapter} dialogRef={deletedialogRef} closeForm={closedeleteForm}/>
                    )
                }
            </div>
        </>
    );
}
