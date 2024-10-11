import React, { ReactElement, useEffect, useRef, useState } from 'react';
import CourseForm from '../../components/Form/CourseForm';
import { flushSync } from 'react-dom';
import url from '../../helper/backendUrl';
import { useNavigate } from 'react-router';
import { courseProps } from '../../types/courseProps';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import CourseDeleteForm from '../../components/Form/CourseDeleteForm';
import FilterBar from '../../components/FilterBar';
import TopBar from '../../components/TopBar';
import axiosInstance from '../../helper/axiosInstance';
import DomainDialog from '../../components/Dialog/DomainDialog';
import { ToastContainer } from 'react-toastify';
export default function Course(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Array<courseProps>>([]);
  const [pagecount, setPagecount] = useState<number>(0);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [course, setCourse] = useState<courseProps>();
  const [editopen, setEditopen] = useState<boolean>(false);
  const [deleteopen, setDeleteopen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deletedialogRef = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState<string>('');
  const [domain, setDomain] = useState<boolean>(false);
  const domainDialogRef = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    async function dataWrapper() {
      let urlconstructor = `/user/course?page=${currentpage}`;
      if (search) {
        urlconstructor = `/user/course?page=${currentpage}&search=${search}`;
      }
      const response = (await axiosInstance.get(urlconstructor)).data;
      setCourses(response.courses);
      setPagecount(response.pageLength);
      dispatch(setPage('course'));
    }
    dataWrapper();
  }, [currentpage, dispatch, search]);
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
  const courseNavHandler = (id: string) => {
    navigate('/admin/roadmap', { state: { id: id } });
  };
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

  const courseModalHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
  };

  const editModalHandler = (course: courseProps) => {
    setCourse(course);
    flushSync(() => {
      setEditopen(true);
    });
    dialogRef.current?.showModal();
  };

  const deleteModalHandler = (course: courseProps) => {
    setCourse(course);
    flushSync(() => {
      setDeleteopen(true);
    });
    deletedialogRef.current?.showModal();
  };

  const closeEditHandler = () => {
    dialogRef.current?.close();
    setEditopen(false);
  };
  const closeDeleteHandler = () => {
    setDeleteopen(false);
    deletedialogRef.current?.close();
  };
  const domainHandler = () => {
    flushSync(() => {
      setDomain(true);
    });
    domainDialogRef.current?.showModal();
  };
  const closeDomainHandler = () => {
    domainDialogRef.current?.close();
    setDomain(false);
  };

  return (
    <>
      <TopBar
        currentpage={currentpage}
        setCourses={setCourses}
        search={search}
        setSearch={setSearch}
      />
      <FilterBar currentpage={currentpage} setResult={setCourses} />
      <button
        onClick={domainHandler}
        className="ml-36 border  border-b-black border-t-white border-l-white border-r-white "
      >
        Domain
      </button>
      <div className="ml-36 mt-10 flex items-center justify-evenly flex-wrap ">
        {courses.map((course) => {
          return (
            <div
              key={course._id}
              onClick={() => courseNavHandler(course._id)}
              className={`${
                course.unlistStatus ? 'bg-gray-200' : ''
              } hover:bg-gray-200 p-3 flex h-72 w-80 shadow-xl items-center justify-center flex-col`}
            >
              <img
                className="w-full h-40 rounded-lg"
                src={`${url}/course/${course.courseImage}`}
              />
              <div className="flex items-center justify-end w-full mt-2 ">
                <img
                  onClick={(e) => courseModalHandler(e)}
                  src="/ellipsis.png"
                  className="h-3 w-3 m-2"
                />

                <img
                  className="h-4 w-4 m-2"
                  src="/chapter/delete.png"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteModalHandler(course);
                  }}
                />
                <img
                  className="h-4 w-4 m-2"
                  src="/course/edit.png"
                  onClick={(e) => {
                    e.stopPropagation();
                    editModalHandler(course);
                  }}
                />
              </div>
              <p
                className={`${
                  course.unlistStatus ? 'line-through' : ''
                } text-center text-2xl font-light`}
              >
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
            style={{ fontSize: '4vw' }}
            className="flex items-center justify-center text-4xl font-light rounded-lg"
          >
            +
          </button>
          <p className="text-sm mt-10 text-gray-500">Add more Courses...</p>
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
      {open && (
        <dialog
          ref={dialogRef}
          className="flex items-center justify-center flex-col w-96  p-2"
        >
          <CourseForm
            setCourses={setCourses}
            course={undefined}
            closeForm={closeForm}
          />
        </dialog>
      )}
      {editopen && (
        <dialog
          ref={dialogRef}
          className="flex items-center justify-center flex-col w-96  p-2"
        >
          <CourseForm
            setCourses={setCourses}
            course={course}
            closeForm={closeEditHandler}
          />
        </dialog>
      )}
      {deleteopen && (
        <CourseDeleteForm
          setCourses={setCourses}
          course={course}
          deletedialogRef={deletedialogRef}
          closeDeleteHandler={closeDeleteHandler}
        />
      )}
      {domain && (
        <DomainDialog
          dialogRef={domainDialogRef}
          closeHandler={closeDomainHandler}
        />
      )}
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </>
  );
}
