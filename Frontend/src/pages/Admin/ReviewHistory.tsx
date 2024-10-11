import { ReactElement, useEffect, useRef, useState } from 'react';
import DashboardTopbar from '../../components/DashboardTopbar';
import axiosInstance from '../../helper/axiosInstance';
import { reviewProps } from '../../types/reviewProps';
import userProps from '../../types/userProps';
import url from '../../helper/backendUrl';
import { Tooltip } from '@reach/tooltip';

import '@reach/tooltip/styles.css'; // Importing built-in styles
import PaginationComponent from '../../components/pagination/PaginationComponent';
import AdminFeedbackDialog from '../../components/Dialog/AdminFeedbackDialog';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router';
import { AdminPath } from '../../types/pathNames';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';

export interface ExtendedReviewProps
  extends Omit<reviewProps, 'revieweeId' | 'reviewerId'> {
  revieweeId: userProps;
  reviewerId?: userProps;
}

export default function ReviewHistory(): ReactElement {
  const [reviews, setReviews] = useState<ExtendedReviewProps[]>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const [review, setReview] = useState<ExtendedReviewProps>();
  const [feedback, setFeedback] = useState<boolean>(false);
  const feedbackRef = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPage('review'));
    async function getReviews() {
      const response = (
        await axiosInstance.get(`/admin/review?page=${currentpage}`)
      ).data;
      if (response.message === 'success') {
        console.log(response);
        setReviews(response.reviews ?? []);
        setPagecount(response.pageLength ?? 0);
      }
    }
    getReviews();
  }, [dispatch, currentpage]);
  const pageHandler = (count: number) => {
    const page = Math.ceil(count / 10) + 1;
    const array = [];
    for (let i = 0; i < page; i++) {
      array.push(i + 1);
    }
    return array;
  };
  const previouspageHandler = () => {
    const prev = currentpage - 1;
    if (prev <= 0) {
      setCurrentpage(1);
      return;
    }
    setCurrentpage(prev);
  };
  const nextpageHandler = () => {
    const next = currentpage + 1;
    if (next > Math.ceil(pagecount / 10) + 1) {
      setCurrentpage(Math.ceil(pagecount / 10) + 1);
      return;
    }
    setCurrentpage(next);
  };
  const openHandler = (review: ExtendedReviewProps) => {
    flushSync(() => {
      setReview(review);
      setFeedback(true);
    });
    feedbackRef.current?.showModal();
  };
  const videoHandler = (review: ExtendedReviewProps) => {
    navigate(AdminPath.adminreviewrecording, { state: review });
  };
  return (
    <>
      <DashboardTopbar />
      <h1 className="ml-36 text-3xl mt-8">REVIEW HISTORY</h1>

      <div className="ml-36 flex-col flex items-center justify-center mt-6 space-y-6">
        {reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center w-96 h-32 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
            <i className="fas fa-comments-slash text-gray-500 text-4xl mb-2"></i>
            <p className="text-gray-700 text-lg font-semibold">
              No Reviews Available
            </p>
            <p className="text-gray-500 text-sm">
              Be the first to add a review!
            </p>
          </div>
        )}

        {reviews.map((review) => (
          <div
            key={review._id}
            className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md flex items-center space-x-6"
          >
            {/* Roadmap Info */}
            <div className="flex items-center space-x-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={`${url}/roadmap/${review.roadmapId.roadmapImage}`}
                alt="Roadmap"
              />
              <p className="text-lg font-medium">
                {review.roadmapId.roadmapName}
              </p>
            </div>

            {/* Reviewee Info */}
            <div className="flex items-center space-x-2">
              <Tooltip label={`Reviewee: ${review?.revieweeId?.email}`}>
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-300 hover:shadow-lg transition-shadow"
                  src={
                    review.revieweeId.profileImage?.includes('http')
                      ? review.revieweeId.profileImage
                      : review.revieweeId.profileImage
                      ? `${url}/profile/${review.revieweeId.profileImage}`
                      : '/user.png'
                  }
                  alt="Reviewee Profile"
                />
              </Tooltip>
              <p className="text-sm text-gray-500">{review.revieweeId.email}</p>
            </div>

            {/* Reviewer Info */}
            <div className="flex items-center space-x-2">
              <Tooltip label={`Reviewer: ${review?.reviewerId?.email}`}>
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-300 hover:shadow-lg transition-shadow"
                  src={
                    review?.reviewerId?.profileImage?.includes('http')
                      ? review.reviewerId.profileImage
                      : review?.reviewerId?.profileImage
                      ? `${url}/profile/${review.reviewerId.profileImage}`
                      : '/user.png'
                  }
                  alt="Reviewer Profile"
                />
              </Tooltip>
              <p className="text-sm text-gray-500">
                {review?.reviewerId?.email}
              </p>
            </div>
            <button
              onClick={() => openHandler(review)}
              className="bg-blue-900 p-2 text-white rounded-lg"
            >
              Feedback
            </button>
            <button
              disabled={!review.reviewStatus}
              onClick={() => videoHandler(review)}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              {' '}
              Recording
            </button>
          </div>
        ))}
      </div>
      <PaginationComponent
        previouspageHandler={previouspageHandler}
        nextpageHandler={nextpageHandler}
        pageHandler={pageHandler}
        pagecount={pagecount}
        currentpage={currentpage}
      />
      {feedback && (
        <AdminFeedbackDialog
          dialogRef={feedbackRef}
          review={review}
          closeHandler={() => {
            setFeedback(false);
            feedbackRef.current?.close();
          }}
        />
      )}
    </>
  );
}
