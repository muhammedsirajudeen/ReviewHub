import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import DashboardTopbar from '../../components/DashboardTopbar';
import { BarChart, Gauge } from '@mui/x-charts';
import { Stack } from '@mui/material';
import axiosInstance from '../../helper/axiosInstance';
import { reviewProps } from '../../types/reviewProps';
import StarRating from '../../components/CustomComponents/StarRating';
import userProps from '../../types/userProps';
import url from '../../helper/backendUrl';

function urlB64ToUint8Array(base64String: string) {
  // Replace '-' with '+' and '_' with '/' to make it standard base64
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64); // Decode base64 string
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0))); // Convert to Uint8Array
}

interface ExtendedReviewProps extends Omit<reviewProps, 'revieweeId'> {
  revieweeId: userProps;
}
interface dashboardProps {
  reviews: reviewProps[];
  reviewsuccess: ExtendedReviewProps[];
  points: number;
}

export default function Dashboard(): ReactElement {
  //proper initialization of state with type safety
  const [aggregate, setAggregate] = useState<dashboardProps>({
    reviewsuccess: [],
    reviews: [],
    points: 0,
  });
  const dispatch = useAppDispatch();
  const renderCount = useRef<number>(0);
  const user=useAppSelector((state)=>state.global.user)
  useEffect(() => {
    async function registerServiceWorker() {
      if (renderCount.current === 0) {
        const register = await navigator.serviceWorker.register('/worker.js', {
          scope: '/',
        });

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY
          ),
        });
        await axiosInstance.post('/notification/subscribe', subscription);
      }
      renderCount.current++;
    }

    async function getAnalytics() {
      try {
        const response = (await axiosInstance.get('/reviewer/dashboard')).data;
        if (response.message === 'success') {
          console.log(response);
          setAggregate({
            reviews: response.reviews ?? [],
            reviewsuccess: response.reviewsuccess ?? [],
            points: response.points ?? 0,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAnalytics();
    registerServiceWorker();
    dispatch(setPage('dashboard'));
  }, [dispatch]);
  return (
    <>
      <DashboardTopbar />
      {!user.reviewerApproval && (
        <div className="flex items-center ml-36 mt-4">
          <div className="bg-yellow-100 text-yellow-800 border border-yellow-400 p-3 rounded-lg flex items-center space-x-2">
            <i className="fas fa-exclamation-circle text-yellow-500"></i>
            <p className="font-semibold text-2xl">Approval Pending</p>
          </div>
        </div>
      )}
      <p className="flex ml-36 text-3xl  w-full items-center justify-start">
        REVIEWER DASHBOARD
      </p>
      <div className="w-full flex items-center justify-center ml-36">
        <div className="w-3/4 flex flex-col items-center justify-start mt-4">
          <h1 className="text-2xl font-bold text-gray-500 w-full">OVERVIEW</h1>
          {/* Overview Container */}
          <div className="flex justify-evenly w-full items-center">
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>COMPLETED REVIEWS</p>
              </div>
              <p className="font-bold text-4xl mt-4">
                {aggregate.reviewsuccess.length}
              </p>
            </div>
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>PENDING REVIEWS</p>
              </div>
              <p className="font-bold text-4xl mt-4">
                {aggregate.reviews.length}
              </p>
            </div>
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>WALLET BALANCE</p>
              </div>
              <p className="font-bold text-4xl mt-4">{aggregate.points}</p>
            </div>
          </div>

          {/* Study Statistics */}
          <h1 className="font-bold text-gray-500 text-2xl w-full mt-10">
            STUDY STATISTICS
          </h1>
          <div className="mt-4 flex items-center justify-between w-full">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <BarChart
                series={[
                  { data: [35, 44, 24, 34] },
                  { data: [51, 6, 49, 30] },
                  { data: [15, 25, 30, 50] },
                  { data: [60, 50, 15, 25] },
                ]}
                height={290}
                width={500}
                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            </div>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1, md: 3 }}
            >
              {['Course Completion Rate', 'Progress Rate'].map(
                (label, index) => (
                  <div key={index}>
                    <h2 className="text-xl font-semibold mb-2">{label}</h2>
                    <Gauge
                      width={100}
                      height={100}
                      value={60}
                      startAngle={index === 1 ? -90 : 0}
                      endAngle={index === 1 ? 90 : 360}
                    />
                  </div>
                )
              )}
            </Stack>
          </div>
          {/* My Courses Section */}
          <h1 className="mt-4 text-2xl font-bold w-full text-gray-500">
            MY FEEDBACKS
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mt-4">
            {aggregate.reviewsuccess.map((reviewsuccess) => {
              return (
                <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-xs">
                  <img
                    src={
                      reviewsuccess.revieweeId.profileImage?.includes('http')
                        ? reviewsuccess.revieweeId.profileImage
                        : reviewsuccess.revieweeId.profileImage
                        ? `${url}/profile/${reviewsuccess.revieweeId.profileImage}`
                        : '/user.png'
                    }
                    className="h-16 w-16 rounded-full border-4 border-gray-300 mt-4 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                    alt="Profile"
                  />
                  <p className="text-gray-700 font-semibold mt-4">
                    {reviewsuccess.revieweeId.email}
                  </p>

                  <div className="mt-2">
                    <StarRating
                      starCount={5}
                      disabled={true}
                      initialCount={
                        reviewsuccess.feedback?.revieweeFeedback.star ?? 0
                      }
                    />
                  </div>

                  <p className="text-sm text-gray-600 mt-2 text-center px-4">
                    {reviewsuccess.feedback?.revieweeFeedback.comment ||
                      'No feedback provided'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right Container for Additional Analytics */}
        <div className="w-1/2 flex items-center justify-start flex-col h-screen mt-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full">
            <h2 className="text-xl font-semibold mb-2">Additional Analytics</h2>
            {/* Add any additional analytics components here */}
            <p>More insights...</p>
          </div>
        </div>
      </div>
    </>
  );
}
