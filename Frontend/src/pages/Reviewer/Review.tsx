import { ReactElement, useEffect, useState } from 'react';
import DashboardTopbar from '../../components/DashboardTopbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import axiosInstance from '../../helper/axiosInstance';
import { reviewProps } from '../../types/reviewProps';
import url from '../../helper/backendUrl';
import PaginationComponent from '../../components/pagination/PaginationComponent';
import { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function Review(): ReactElement {
  const [reviews, setReviews] = useState<Array<reviewProps>>([]);
  const dispatch = useAppDispatch();
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  const user=useAppSelector((state)=>state.global.user)
  useEffect(() => {
    async function reviewFetcher() {
      try {
        const response = (
          await axiosInstance.get(`/reviewer/reviews?page=${currentpage}`)
        ).data;
        if (response.message === 'success') {
          setReviews(response.reviews);
          setPagecount(response.pageLength);
        }
      } catch (error) {
        console.log(error);
      }
    }
    reviewFetcher();
    dispatch(setPage('review'));
  }, [dispatch, currentpage]);
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
  const commitHandler = async (id: string) => {
    try {
      const response = (await axiosInstance.put(`/reviewer/review/${id}`)).data;
      if (response.message === 'success') {
        toast.success('Committed Successfully');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  };
  return (
    <>
      <DashboardTopbar />
      <h1 className="ml-36 text-4xl  text-gray-800 mb-8">REVIEWS</h1>
      <div className="flex items-center justify-center flex-col px-4">
      <section className="mb-12 w-3/4">
          <h2 className="text-2xl font-light mb-6 text-gray-700">
            Scheduled Reviews
          </h2>
          <div className="w-full h-72 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg shadow-sm bg-gray-100">
            {reviews.length === 0 && (
              <p className="text-gray-500">No scheduled reviews yet.</p>
            )}
            {reviews.map((review) => {
              return (
                <div key={review._id} className="flex flex-col items-center justify-start">
                  <img
                    className="h-20 w-20 rounded-lg"
                    src={`${url}/roadmap/${review.roadmapId.roadmapImage}`}
                    alt={review.roadmapId.roadmapName}
                  />
                  <p className="text-xs mt-2 font-semibold">
                    {review.roadmapId.roadmapName}
                  </p>

                  {/* Format the scheduled date */}
                  <div className="flex flex-col items-center mt-2">
                    <p className="text-xs text-gray-600">
                      {new Date(review.scheduledDate).toLocaleDateString(
                        'en-US',
                        { month: 'long', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(review.scheduledDate).toLocaleTimeString(
                        'en-US',
                        { hour: '2-digit', minute: '2-digit', hour12: true }
                      )}
                    </p>
                  </div>
                  <button
                    className="bg-red-700 text-white p-1 text-xs mt-4"
                    // onClick=}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        {reviews.length === 0 ? (
          <div className="text-xl text-gray-500 mt-10">No reviews found</div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="flex items-center justify-between w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-6 p-6 transition transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`${url}/roadmap/${review.roadmapId.roadmapImage}`}
                alt="Roadmap"
                className="h-20 w-20 rounded-xl object-cover mr-6"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">
                  {review.roadmapId.roadmapDescription}
                </h2>
                <p className="text-gray-500 text-sm">
                  Scheduled Date:{' '}
                  <span className="font-bold">
                    {new Date(review.scheduledDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button
              disabled={user._id===review.reviewerId}
                onClick={() => commitHandler(review._id)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
              >
                {user._id===review.reviewerId ? "Already Commited" : "Commit" }
              </button>
            </div>
          ))
        )}
      </div>
      <PaginationComponent
        previouspageHandler={previouspageHandler}
        nextpageHandler={nextpageHandler}
        pageHandler={pageHandler}
        pagecount={pagecount}
        currentpage={currentpage}
      />
      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </>
  );
}
