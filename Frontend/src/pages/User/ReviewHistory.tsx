import { ReactElement, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../helper/axiosInstance';
import { reviewProps } from '../../types/reviewProps';
import url from '../../helper/backendUrl';
import { flushSync } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import ReviewHistoryForm from '../../components/Form/Review/ReviewHistoryForm';
import PaginationComponent from '../../components/pagination/PaginationComponent';

export default function ReviewHistory(): ReactElement {
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const [reviews, setReviews] = useState<reviewProps[]>([]);
  const [review, setReview] = useState<reviewProps>();
  const feedbackRef = useRef<HTMLDialogElement>(null);
  const [feedback, setFeedback] = useState<boolean>(false);
  const viewfeedbackRef = useRef<HTMLDialogElement>(null);
  const [viewfeedback, setViewfeedback] = useState<boolean>(false);
    
  useEffect(() => {
    async function historyFetcher() {
      try {
        const response = (await axiosInstance.get('/user/review/history')).data;
        if (response.message === 'success') {
          setReviews(response.reviews);
          setPagecount(response.pageLength)
        }
      } catch (error) {
        console.log(error);
      }
    }
    historyFetcher();
  }, []);

  const feedbackHandler = (review: reviewProps) => {
    flushSync(() => {
      setFeedback(true);
      setReview(review);
    });
    feedbackRef.current?.showModal();
  };

  const closeFeedbackHandler = () => {
    setFeedback(false);
    setReview(undefined);
    feedbackRef.current?.close();
  };
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10);
    return Array.from({ length: page }, (_, i) => i + 1);
  };

  const previouspageHandler = () => {
    setCurrentpage((prev) => Math.max(prev - 1, 1));
  };

  const nextpageHandler = () => {
    setCurrentpage((prev) => Math.min(prev + 1, Math.ceil(pagecount / 10)));
  };

  return (
    <>
      <h1 className="text-4xl ml-36 mt-10 ">REVIEW HISTORY</h1>
      <div className="flex items-center justify-center mt-8">
        <div className="grid grid-cols-1 gap-6 w-3/4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white shadow-md rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <p className="text-lg text-gray-600">
                  {new Date(review.scheduledDate).toLocaleDateString()}
                </p>
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={`${url}/roadmap/${review.roadmapId.roadmapImage}`}
                  alt={review.roadmapId.roadmapName}
                />
                <p className="text-xl font-medium">
                  {review.roadmapId.roadmapName}
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  View Feedback
                </button>
                <button
                  onClick={() => feedbackHandler(review)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Give Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
        {feedback && (
          <ReviewHistoryForm
            dialogRef={feedbackRef}
            closeHandler={closeFeedbackHandler}
            review={review}
          />
        )}
        <ToastContainer
          style={{
            backgroundColor: 'gray',
            color: 'white',
            borderRadius: '10px',
          }}
        />
      </div>
      <PaginationComponent
        previouspageHandler={previouspageHandler}
        nextpageHandler={nextpageHandler}
        pageHandler={pageHandler}
        pagecount={pagecount}
        currentpage={currentpage}
      />
    </>
  );
}
