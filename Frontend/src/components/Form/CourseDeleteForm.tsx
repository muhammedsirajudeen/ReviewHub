import { ReactElement, Ref } from 'react';
import { courseProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';

export default function CourseDeleteForm({
  deletedialogRef,
  closeDeleteHandler,
  course,
}: {
  deletedialogRef: Ref<HTMLDialogElement>;
  closeDeleteHandler: VoidFunction;
  course: courseProps | undefined;
}): ReactElement {

  const deleteHandler=async ()=>{
   const response=(
    await axiosInstance.delete(`/admin/course/${course?._id}`)
   ).data
   if(response.message==="success"){
    toast("deleted successfully")
    setTimeout(()=>window.location.reload(),1000)
   }else{
    toast(response.message)
   }
  }  
  return (
    <>
    <dialog
      ref={deletedialogRef}
      className="flex items-center h-40 justify-start flex-col w-96 p-2"
    >
      <button
        onClick={closeDeleteHandler}
        className="bg-black text-white p-2 h-6 flex items-center justify-center"
      >
        x
      </button>
      <p className="font-light text-xs mt-4">Do you wanna Delete The Course ?</p>
      <p className="font-bold text-xs">{course?.courseName}</p>
      <button onClick={deleteHandler} className='mt-4  flex items-center justify-center'>
        <img className='scale-125' src='/chapter/delete.png'/>
      </button>
    </dialog>
    <ToastContainer/>
    </>
  );
}
