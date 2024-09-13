import { ReactElement, Ref } from 'react';
import { chapterProps } from '../../types/courseProps';
import axios from 'axios';
import url from '../../helper/backendUrl';
import { toast } from 'react-toastify';

export default function ChapterDelete({
  dialogRef,
  closeForm,
  chapter,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeForm: VoidFunction;
  chapter: chapterProps | undefined;
}): ReactElement {
    const deleteHandler=async ()=>{
        const response=(
            await axios.delete(`${url}/admin/chapter/${chapter?._id}`,
                {
                    headers:{
                        Authorization:`Bearer ${window.localStorage.getItem("token")}`
                    }
                }
            )
        ).data
        if(response.message==="success"){
            toast("deleted successfully")
            setTimeout(()=>window.location.reload(),1000)
        }else{
            toast(response.message)
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
