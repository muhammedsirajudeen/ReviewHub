import { ReactElement, Ref } from "react";
import StarRating from "../CustomComponents/StarRating";
import { reviewProps } from "../../types/reviewProps";
import { useAppSelector } from "../../store/hooks";

export default function FeedbackDialog(
    {
        dialogRef,
        closeHandler,
        review
    }
    :
    {
        dialogRef:Ref<HTMLDialogElement>
        closeHandler:VoidFunction
        review:reviewProps | undefined
    }

):ReactElement{
    const user=useAppSelector((state)=>state.global.user)
    return(
        <dialog className="h-96 w-96 shadow-xl rounded-lg flex items-center justify-center flex-col"  ref={dialogRef} >
            <button className="absolute top-0 hover:text-red-500" onClick={closeHandler} >x</button>
            <StarRating disabled={true} initialCount={user.authorization==='reviewer' ? review?.feedback?.revieweeFeedback?.star ?? 0 : review?.feedback?.reviewerFeedback?.star ?? 0 } starCount={5}/>
            <textarea className="border border-black w-72 h-20" readOnly value={user.authorization==='reviewer' ? review?.feedback?.revieweeFeedback?.comment : review?.feedback?.reviewerFeedback.comment }/>
        </dialog>
    )
}