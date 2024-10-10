import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import DashboardTopbar from '../../components/DashboardTopbar';
import { BarChart, Gauge } from '@mui/x-charts';
import { Stack } from '@mui/material';
import axiosInstance from '../../helper/axiosInstance';
import { courseProps } from '../../types/courseProps';
import { reviewProps } from '../../types/reviewProps';
import url from '../../helper/backendUrl';
import { format } from 'date-fns';

function urlB64ToUint8Array(base64String: string) {
  // Replace '-' with '+' and '_' with '/' to make it standard base64
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64); // Decode base64 string
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0))); // Convert to Uint8Array
}

interface dashboardProps {
  courses:courseProps[] ;
  reviews: reviewProps[];
  completedReviews: reviewProps[];
  points:number;
}

export default function Dashboard(): ReactElement {
  //proper initialization of state with type safety
  const [aggregate, setAggregate] = useState<dashboardProps>({
    completedReviews: [],
    courses: [],
    reviews: [],
    points: 0,
  });
  const dispatch = useAppDispatch();
  const renderCount = useRef<number>(0);
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
          setAggregate(
            {
              reviews:response.reviews ?? [],
              completedReviews:response.completedreviews ?? [],
              courses:response.courses ?? [],
              points:response.points ?? 0
            }
          )
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
      <p className="flex ml-36 text-3xl  w-full items-center justify-start">
       REVIEWER DASHBOARD
      </p>
      <div className="w-full flex items-center justify-center ml-36">
        <div className="w-3/4 flex flex-col items-center justify-start mt-4">
          <h1 className="text-2xl font-bold text-gray-500 w-full">OVERVIEW</h1>
          {/* Overview Container */}
          <div className="flex justify-evenly w-full items-center">
          <div
                className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
              >
                <div className="text-xs font-bold  flex justify-evenly w-full">
                  <img
                    className="bg-blue-500 p-1 rounded-lg"
                    src="/dashboard/school.png"
                  />
                  <p>COMPLETED REVIEWS</p>
                </div>
                <p className="font-bold text-4xl mt-4">{aggregate.completedReviews.length}</p>
              </div>
              <div
                className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
              >
                <div className="text-xs font-bold  flex justify-evenly w-full">
                  <img
                    className="bg-blue-500 p-1 rounded-lg"
                    src="/dashboard/school.png"
                  />
                  <p>PENDING REVIEWS</p>
                </div>
                <p className="font-bold text-4xl mt-4">{aggregate.reviews.length}</p>
              </div>
              <div
                className="h-40 flex flex-col items-center justify-center w-52 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
              >
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
            MY COURSES
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mt-4">
              {
                aggregate.courses.map((course)=>{
                  return(
                    <div key={course._id} className='flex flex-col items-center justify-start'>
                      <img className='h-32 w-32 rounded-xl' src={`${url}/course/${course.courseImage}`}/>
                      <p className='text-xs' >{format(new Date(course.postedDate),"PPp")}</p>
                      <p className='text-lg mt-4' >{course.courseName}</p>
                      <p className='text-xs font-semibold' >{course.courseDescription}</p>
                    </div>
                  )
                })
              }
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
