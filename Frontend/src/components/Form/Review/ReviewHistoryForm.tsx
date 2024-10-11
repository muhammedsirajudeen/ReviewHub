import { Dispatch, ReactElement, Ref, SetStateAction, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { reviewProps } from '../../../types/reviewProps';
import StarRating from '../../CustomComponents/StarRating';
import axiosInstance from '../../../helper/axiosInstance';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../store/hooks';
import { produce } from 'immer';

// Define the form data interface
interface FeedbackFormData {
  feedback: string;
}

export default function ReviewHistoryForm({
  dialogRef,
  closeHandler,
  review,
  setReviews,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review: reviewProps | undefined;
  setReviews: Dispatch<SetStateAction<reviewProps[]>>;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>();
  const user = useAppSelector((state) => state.global.user);

  const [starcount, setStarcount] = useState<number>(() => {
    if (user.authorization === 'reviewer') {
      if (review?.feedback) {
        if (review.feedback.reviewerFeedback) {
          return review.feedback.reviewerFeedback.star ?? 0;
        }
        return 0;
      }
    } else {
      if (review?.feedback) {
        if (review.feedback.revieweeFeedback) {
          return review.feedback.revieweeFeedback.star ?? 0;
        }
      }
      return 0;
    }
    return 0;
  });
  // Handle form submission
  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    try {
      const response = (
        await axiosInstance.put(`/user/review/history/${review?._id}`, {
          comment: data.feedback,
          star: starcount,
        })
      ).data;
      if (response.message === 'success') {
        toast.success('Feedback Submitted');
        console.log(response);

        setReviews(
          produce((draft) => {
            draft.forEach((d) => {
              if (d._id === review?._id) {
                Object.assign(d, response.review); // Mutate the review with the new data
              }
            });
          })
        );
        reset();
        closeHandler();
      }
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    }
  };

  return (
    <dialog
      style={{ height: '50vh', width: '50vw' }}
      ref={dialogRef}
      className="h-96 w-96 rounded-xl bg-white flex flex-col"
    >
      <button
        className="absolute top-0 left-0 hover:text-red-500"
        onClick={closeHandler}
      >
        x
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <p className="mt-10 text-center text-xs font-light">
          Give feedback to?{' '}
          <span className="text-lg font-bold">
            {review?.roadmapId.roadmapName}
          </span>
        </p>

        <StarRating
          initialCount={starcount}
          setStarcount={setStarcount}
          starCount={5}
        />

        {/* Feedback Text Area */}
        <textarea
          defaultValue={
            user.authorization === 'reviewer'
              ? review?.feedback?.reviewerFeedback?.comment ?? ''
              : review?.feedback?.revieweeFeedback?.comment ?? ''
          }
          {...register('feedback', {
            required: 'Feedback is required',
            minLength: {
              value: 10,
              message: 'Feedback must be at least 10 characters long',
            },
            validate: {
              noSpecialChars: (value) =>
                /^[a-zA-Z0-9 ]*$/.test(value) ||
                'No special characters allowed, except spaces',
              noOnlySpaces: (value) =>
                value.trim().length > 0 ||
                'Feedback cannot contain only spaces',
            },
          })}
          className="p-2 border rounded h-52 w-96"
          placeholder="Provide your feedback"
        />
        {errors.feedback && (
          <p className="text-red-500 text-xs mt-1">{errors.feedback.message}</p>
        )}

        <button
          type="submit"
          className="mt-5 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </dialog>
  );
}
