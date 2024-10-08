import { ReactElement, Ref, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { reviewProps } from '../../../types/reviewProps';
import StarRating from '../../CustomComponents/StarRating';

// Define the form data interface
interface FeedbackFormData {
  feedback: string;
}

export default function ReviewHistoryForm({
  dialogRef,
  closeHandler,
  review,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  review: reviewProps | undefined;
}): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>();
  const [starcount, setStarcount] = useState<number>(-1);
  // Handle form submission
  const onSubmit: SubmitHandler<FeedbackFormData> = (data) => {
    console.log(data);
    // reset(); // Reset the form after submission
    // closeHandler(); // Optionally close the dialog after submission
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

        <StarRating setStarcount={setStarcount} starCount={5} />

        {/* Feedback Text Area */}
        <textarea
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
          className="p-2 border rounded"
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
