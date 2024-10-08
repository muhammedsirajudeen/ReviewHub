import { ReactElement, Ref } from "react";
import { reviewProps } from "../../../types/reviewProps";
import StarRating from "../../CustomComponents/StarRating";

export default function ReviewHistoryForm({
  dialogRef,
  closeHandler,
  review,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review:reviewProps | undefined
}): ReactElement {
  return (
    <dialog ref={dialogRef} className="h-96 w-96 rounded-xl bg-white">
      <button className="absolute top-0 left-0 hover:text-red-500"  onClick={closeHandler}>x</button>
      <StarRating starCount={5}/>
    </dialog>
  );
}