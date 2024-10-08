import { ReactElement, useEffect, useState } from 'react';
import DashboardTopbar from '../../components/DashboardTopbar';
import axiosInstance from '../../helper/axiosInstance';
import { reviewProps } from '../../types/reviewProps';
import userProps from '../../types/userProps';
import url from '../../helper/backendUrl';
import { Tooltip } from '@reach/tooltip';

import '@reach/tooltip/styles.css'; // Importing built-in styles
import PaginationComponent from '../../components/pagination/PaginationComponent';

interface ExtendedInterface
  extends Omit<reviewProps, 'revieweeId' | 'reviewerId'> {
  revieweeId: userProps;
  reviewerId: userProps;
}

export default function ReviewHistory(): ReactElement {
  const [reviews, setReviews] = useState<ExtendedInterface[]>([]);
  const [currentpage, setCurrentpage] = useState<number>(1);
  const [pagecount, setPagecount] = useState<number>(0);
  useEffect(() => {
    async function getReviews() {
      const response = (await axiosInstance.get('/admin/review')).data;
      if (response.message === 'success') {
        console.log(response);
        setReviews(response.reviews ?? []);
        setPagecount(response.pageLength ?? 0)
      }
    }
    getReviews();
  }, []);
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
  return (
    <>
      <DashboardTopbar />
      <h1 className="ml-36 text-3xl mt-8">REVIEW HISTORY</h1>

      <div className="ml-36 flex-col flex items-center justify-center mt-6 space-y-6">
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
              <Tooltip label={`Reviewee: ${review.revieweeId.email}`}>
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
              <Tooltip label={`Reviewer: ${review.reviewerId.email}`}>
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-300 hover:shadow-lg transition-shadow"
                  src={
                    review.reviewerId.profileImage?.includes('http')
                      ? review.reviewerId.profileImage
                      : review.reviewerId.profileImage
                      ? `${url}/profile/${review.reviewerId.profileImage}`
                      : '/user.png'
                  }
                  alt="Reviewer Profile"
                />
              </Tooltip>
              <p className="text-sm text-gray-500">{review.reviewerId.email}</p>
            </div>
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
    </>
  );
}
