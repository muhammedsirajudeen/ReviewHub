import { ReactElement, Ref } from 'react';
import { ExtendedReviewProps } from '../../pages/Admin/ReviewHistory';
import StarRating from '../CustomComponents/StarRating';

export default function AdminFeedbackDialog({
  dialogRef,
  closeHandler,
  review,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review: ExtendedReviewProps | undefined;
}): ReactElement {
  return (
    <dialog
      style={{ height: '50vh', width: '50vw' }}
      className="flex items-center shadow-xl rounded-lg flex-col justify-start"
      ref={dialogRef}
    >
      <button
        className="absolute top-0 left-0 hover:text-red-500"
        onClick={closeHandler}
      >
        x
      </button>
      <h1 className="mt-10 text-xs">REVIEWEE FEEDBACK</h1>
      <StarRating
        key={0}
        starCount={5}
        disabled={true}
        initialCount={review?.feedback?.revieweeFeedback?.star ?? 0}
      />
      <textarea readOnly value={review?.feedback?.revieweeFeedback?.comment} />
      <h1 className="text-xs mt-10">REVIEWER FEEDBACK</h1>
      <StarRating
        key={1}
        starCount={5}
        disabled={true}
        initialCount={review?.feedback?.reviewerFeedback?.star ?? 0}
      />
      <textarea readOnly value={review?.feedback?.reviewerFeedback?.comment} />
    </dialog>
  );
}
