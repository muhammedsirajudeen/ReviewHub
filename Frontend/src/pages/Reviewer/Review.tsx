import { ReactElement, useEffect, useState } from "react";
import DashboardTopbar from "../../components/DashboardTopbar";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";
import axiosInstance from "../../helper/axiosInstance";
import { reviewProps } from "../../types/reviewProps";
import url from "../../helper/backendUrl";
import PaginationComponent from "../../components/pagination/PaginationComponent";

export default function Review(): ReactElement {
  const [reviews, setReviews] = useState<Array<reviewProps>>([]);
  const dispatch = useAppDispatch();
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  useEffect(() => {
    async function reviewFetcher() {
      try {
        const response = (await axiosInstance.get(`/reviewer/reviews?page=${currentpage}`)).data;
        if (response.message === "success") {
          setReviews(response.reviews);
          setPagecount(response.pageLength)
        }
      } catch (error) {
        console.log(error);
      }
    }
    reviewFetcher();
    dispatch(setPage("review"));
  }, [dispatch,currentpage]);
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
      <DashboardTopbar />
      <h1 className="ml-36 text-4xl  text-gray-800 mb-8">REVIEWS</h1>
      <a href="/reviewer/review/manage" className="ml-36 border-b-black border border-white " >Manage</a>
      <div className="flex items-center justify-center flex-col px-4">
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
                  Scheduled Date:{" "}
                  <span className="font-bold">
                    {new Date(review.scheduledDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition">
                Commit
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
    </>
  );
}
