import { ReactElement, Ref } from 'react';
import StarRating from '../CustomComponents/StarRating';
import { useAppSelector } from '../../store/hooks';
import { ExtendedReviewProps } from '../../pages/Admin/ReviewHistory';
import url from '../../helper/backendUrl';

export default function FeedbackDialog({
  dialogRef,
  closeHandler,
  review,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review: ExtendedReviewProps | undefined;
}): ReactElement {
  const user = useAppSelector((state) => state.global.user);
  return (
    <dialog
      className="h-96 w-96 shadow-xl rounded-lg flex items-center justify-center flex-col"
      ref={dialogRef}
    >
      <button
        className="absolute top-0 hover:text-red-500"
        onClick={closeHandler}
      >
        x
      </button>
      {user.authorization === 'reviewer' ? (
        <>
          <img
            src={
              review?.revieweeId?.profileImage?.includes('http')
                ? review.revieweeId.profileImage
                : review?.revieweeId.profileImage
                ? `${url}/profile/${review.revieweeId.profileImage}`
                : '/user.png'
            }
            className="h-48 w-48 rounded-full mt-4 border-4 border-gray-300 cursor-pointer transition-transform hover:scale-105"
            alt="Profile"
          />
          <p>{review?.revieweeId.email}</p>
        </>
      ) : (
        <>
          <img
            src={
              review?.reviewerId?.profileImage?.includes('http')
                ? review.reviewerId.profileImage
                : review?.reviewerId?.profileImage
                ? `${url}/profile/${review.reviewerId.profileImage}`
                : '/user.png'
            }
            className="h-12 w-12 rounded-full mt-4 border-4 border-gray-300 cursor-pointer transition-transform hover:scale-105"
            alt="Profile"
          />

          <p>{review?.reviewerId?.email}</p>
        </>
      )}
      <StarRating
        disabled={true}
        initialCount={
          user.authorization === 'reviewer'
            ? review?.feedback?.revieweeFeedback?.star ?? 0
            : review?.feedback?.reviewerFeedback?.star ?? 0
        }
        starCount={5}
      />
      <textarea
        className="border border-black w-72 h-20"
        readOnly
        value={
          user.authorization === 'reviewer'
            ? review?.feedback?.revieweeFeedback?.comment
            : review?.feedback?.reviewerFeedback?.comment
        }
      />
    </dialog>
  );
}
