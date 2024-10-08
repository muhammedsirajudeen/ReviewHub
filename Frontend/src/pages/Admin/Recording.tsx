import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ExtendedReviewProps } from './ReviewHistory';
import url from '../../helper/backendUrl';

export default function Recording(): ReactElement {
  const location = useLocation();
  const [data, setData] = useState<boolean>(false);
  const [review, setReview] = useState<ExtendedReviewProps>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (location.state) {
      setData(true);
      setReview(location.state);
    }
    setLoading(false);
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <h1 className="text-4xl font-semibold text-center mb-6">Recording</h1>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : !data ? (
          <div className="text-center text-gray-600">No data available</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Reviewee Recording */}
            <div className="flex flex-col items-center p-4 m-2 bg-blue-50 rounded-lg shadow-md flex-grow">
              <h2 className="font-bold text-lg">Reviewee Recording</h2>
              <img
                className="h-16 w-16 rounded-full object-cover border border-gray-300 shadow hover:shadow-xl transition-shadow"
                src={
                  review?.revieweeId.profileImage?.includes('http')
                    ? review?.revieweeId.profileImage
                    : review?.revieweeId.profileImage
                    ? `${url}/profile/${review?.revieweeId.profileImage}`
                    : '/user.png'
                }
                alt="Reviewee Profile"
              />
              <p className="text-sm text-gray-700">{review?.revieweeId?.email}</p>
              <video
                src={`${url}/reviewrecording/user-${review?._id}.webm`}
                autoPlay
                controls
                className="h-96 w-96 mt-2 rounded-lg border border-gray-300 shadow-md"
              />
            </div>

            {/* Reviewer Recording */}
            <div className="flex flex-col items-center p-4 m-2 bg-blue-50 rounded-lg shadow-md flex-grow">
              <h2 className="font-bold text-lg">Reviewer Recording</h2>
              <img
                className="h-16 w-16 rounded-full object-cover border border-gray-300 shadow hover:shadow-xl transition-shadow"
                src={
                  review?.reviewerId.profileImage?.includes('http')
                    ? review?.reviewerId.profileImage
                    : review?.reviewerId.profileImage
                    ? `${url}/profile/${review?.reviewerId.profileImage}`
                    : '/user.png'
                }
                alt="Reviewer Profile"
              />
              <p className="text-sm text-gray-700">{review?.reviewerId?.email}</p>
              <video
                src={`${url}/reviewrecording/reviewer-${review?._id}.webm`}
                autoPlay
                controls
                className="h-96 w-96 mt-2 rounded-lg border border-gray-300 shadow-md"
              />
            </div>
          </div>
        )}
        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200 shadow-lg"
            onClick={() => window.location.reload()} // Example action
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
