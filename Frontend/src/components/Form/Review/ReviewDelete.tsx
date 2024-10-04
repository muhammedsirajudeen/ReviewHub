import { Dispatch, ReactElement, Ref, SetStateAction } from "react";
import { reviewProps } from "../../../types/reviewProps";
import { toast } from "react-toastify";
import axiosInstance from "../../../helper/axiosInstance";
import { produce } from "immer";

export default function ReviewDelete({
  dialogRef,
  closeHandler,
  review,
  setReviews
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review: reviewProps | undefined;
  setReviews:Dispatch<SetStateAction<Array<reviewProps>>>
}): ReactElement {
    const reviewCancel=async ()=>{
        try{
            const response=(
                await axiosInstance.delete(`/user/review/${review?._id}`)
            ).data
            if(response.message==="success"){
                setReviews(produce((draft)=>{
                    return(

                        draft.filter((d)=>d._id!==review?._id)
                    )
                }))
                toast.success("Deleted Successfully")
                closeHandler()
                
            }
        }catch(error){
            console.log(error)
            toast.error("server error occured")
        }
    }
  return (
    <dialog
      className="h-96 w-full max-w-lg rounded-lg shadow-lg bg-white flex flex-col items-center justify-center p-6 space-y-4 animate-fadeIn"
      ref={dialogRef}
    >
      <button
        onClick={closeHandler}
        className="self-end absolute top-0 text-gray-500 hover:text-gray-700 transition duration-200 text-xl"
        aria-label="Close"
      >
        &times;
      </button>
      <p className="font-bold  text-gray-800 mb-4 text-xs">
        Do you want to cancel the review for
        <span className="text-red-600 font-semibold"> {review?.roadmapId.roadmapName}</span>?
      </p>
      <div className="flex space-x-4">
        <button
          onClick={reviewCancel}
          className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition duration-300"
        >
          Cancel Review
        </button>
        <button
          onClick={closeHandler}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
