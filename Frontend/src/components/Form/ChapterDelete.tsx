import { Dispatch, ReactElement, Ref, SetStateAction } from 'react';
import { chapterProps } from '../../types/courseProps';
import { toast } from 'react-toastify';
import axiosInstance from '../../helper/axiosInstance';
import { produce } from 'immer';

export default function ChapterDelete({
  dialogRef,
  closeForm,
  chapter,
  setChapters
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
  setChapters:Dispatch<SetStateAction<chapterProps[]>>
}): ReactElement {
    const deleteHandler=async ()=>{
      try {        
        const response=(
            await axiosInstance.delete(`/admin/chapter/${chapter?._id}`)
        ).data
        if(response.message==="success"){
            toast.success("deleted successfully")
            setChapters(produce((draft)=>{
              draft.forEach((d,index)=>{
                if(d._id===chapter?._id){
                  draft.splice(index,1)
                }
              })
            }))
            closeForm()
            // setTimeout(()=>window.location.reload(),1000)
        }else{
            toast(response.message)
        }
      } catch (error) {
        console.log(error)
        toast.error("Please try again")
      }
    }
  return (
    <dialog
      ref={dialogRef}
      className="h-96 w-96 flex items-center justify-start flex-col"
    >
      <button
        onClick={closeForm}
        className="flex items-center justify-center bg-black p-2 text-white"
      >
        x
      </button>
      <p className="text-xl font-light mt-4">
        Do you wanna delete Chapter ?{' '}
        
      </p>
      <span className="font-bold text-xs mt-4">{chapter?.chapterName}</span>
      <button onClick={deleteHandler} className="flex items-center justify-center mt-4 scale-150">
        <img src="/chapter/delete.png" />
      </button>
    </dialog>
  );
}
