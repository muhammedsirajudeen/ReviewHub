import { ReactElement, useEffect, useRef, useState } from 'react';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { chapterProps, roadmapProps } from '../../types/courseProps';
import { ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { flushSync } from 'react-dom';
import ChapterForm from '../../components/Form/ChapterForm';
import ChapterDelete from '../../components/Form/ChapterDelete';
import TopBar from '../../components/TopBar';
import FilterBarRoadmap from '../../components/FilterBarRoadmap';
import axiosInstance from '../../helper/axiosInstance';

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
            let urlconstructor=`/admin/chapter/${roadmap._id}?page=${currentpage}`
            if(search) urlconstructor=`/admin/chapter/${roadmap._id}?page=${currentpage}&search=${search}`
            const response = (
                await axiosInstance.get(
                        urlconstructor,
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
            <TopBar search={search} setSearch={setSearch} setChapters={setChapters} currentpage={currentpage} roadmapId={roadmap._id} />
            <FilterBarRoadmap type='chapter' currentpage={currentpage} roadmapId={roadmap._id} setChapters={setChapters} />
            <div className="container mx-auto p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                    {/* Roadmap Info */}
                    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2">
                        <img className="h-32 w-full object-cover rounded-lg" src={roadmap.roadmapImage ? `${url}/roadmap/${roadmap.roadmapImage}` : `/roadmap/roadmapbg.png`} alt="Roadmap" />
                        <h2 className="text-3xl font-bold mt-4">{roadmap.roadmapName}</h2>
                        <p className="text-gray-600 mt-2">{roadmap.roadmapDescription}</p>
                        <span className="text-gray-500 mt-2">Lessons: {roadmap.lessonCount}</span>
                    </div>
                    {/* Add Chapter Form */}
                    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Add New Chapter</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <input
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Enter chapter name"
                                {...register('chapterName', {
                                    required: {
                                        value: true,
                                        message: 'Please enter the chapter name',
                                    },
                                    minLength: {
                                        value: 5,
                                        message: 'Minimum length is 5 characters',
                                    },
                                    validate: (value: string) => {
                                        if (SpecialCharRegex.test(value))
                                            return 'No special characters allowed';
                                        return true;
                                    },
                                })}
                            />
                            {errors.chapterName && (
                                <span className="text-red-500 text-sm">{errors.chapterName.message}</span>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Create Chapter
                            </button>
                        </form>
                    </div>
                </div>

                {/* Chapter List */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">{roadmap.roadmapName} - Chapters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters.map((chapter) => (
                            <div key={chapter._id} className="bg-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between">
                                <span className="text-gray-800">{chapter.chapterName}</span>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => editModalHandler(chapter)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => deleteModalHandler(chapter)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={previouspageHandler}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Previous
                    </button>
                    {pageHandler(pagecount).map((page) => (
                        <button
                            key={page}
                            className={`px-4 py-2 border rounded-lg ${currentpage === page ? 'bg-blue-500 text-white' : 'bg-white'}`}
                            onClick={() => setCurrentpage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={nextpageHandler}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            {open && (
                <ChapterForm  setChapters={setChapters} roadmapId={roadmap._id} method={method} chapterName={chaptername} chapter={chapter} dialogRef={dialogRef} closeForm={closeForm} />
            )}
            {deleteopen && (
                <ChapterDelete setChapters={setChapters} chapter={chapter} dialogRef={deletedialogRef} closeForm={closedeleteForm} />
            )}
            <ToastContainer />
        </>
    );
}
