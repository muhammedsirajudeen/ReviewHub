import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import { BarChart } from '@mui/x-charts/BarChart';

import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import axiosInstance from '../../helper/axiosInstance';
import DashboardTopbar from '../../components/DashboardTopbar';

function urlB64ToUint8Array(base64String: string) {
  // Replace '-' with '+' and '_' with '/' to make it standard base64
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64); // Decode base64 string
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0))); // Convert to Uint8Array
}

interface dashboardProps {
  completedreviews: number;
  courses: number;
  paymentfailure: number;
  paymentsuccess: number;
  reviews: number;
  users: number;
  message: string;
  totalamount: number;
}

export default function AdminDashboard(): ReactElement {
  const [aggregate, setAggregate] = useState<dashboardProps>({
    completedreviews: 0,
    courses: 0,
    paymentfailure: 0,
    paymentsuccess: 0,
    users: 0,
    reviews: 0,
    message: '',
    totalamount: 0,
  });
  const dispatch = useAppDispatch();
  const renderCount = useRef<number>(0);
  useEffect(() => {
    dispatch(setPage('dashboard'));
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
    async function getDashboardDetails() {
      try {
        const response = (await axiosInstance.get('/admin/dashboard'))
          .data as dashboardProps;
        if (response.message === 'success') {
          console.log(response);
          setAggregate({
            paymentfailure: response.paymentfailure,
            paymentsuccess: response.paymentsuccess,
            users: response.users,
            courses: response.courses,
            reviews: response.reviews,
            completedreviews: response.completedreviews,
            message: '',
            totalamount: response.totalamount,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getDashboardDetails();
    registerServiceWorker();
  }, [dispatch]);

  return (
    <>
      <DashboardTopbar />
      <p className="flex ml-36 text-3xl font-bold w-full items-center justify-start">
        ADMIN DASHBOARD
      </p>
      <div className="w-full flex items-center justify-center ml-36">
        <div className="w-3/4 flex flex-col items-center justify-start mt-4">
          <h1 className="text-2xl font-bold text-gray-500 w-full">OVERVIEW</h1>
          {/* Overview Container */}
          <div className="flex justify-evenly w-full items-center flex-wrap">
            <div className="h-52 flex flex-col items-center justify-center w-72 mt-4 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>COMPLETED REVIEWS</p>
              </div>
              <p className="font-bold text-4xl mt-4">
                {aggregate.completedreviews}
              </p>
            </div>
            <div className="h-52 flex flex-col items-center justify-center w-72 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>PENDING REVIEWS</p>
              </div>
              <p className="font-bold text-4xl mt-4">{aggregate.reviews}</p>
            </div>
            <div className="h-52 flex flex-col items-center justify-center w-72 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>FAILED PAYMENTS COUNT</p>
              </div>
              <p className="font-bold text-4xl mt-4 text-red-600">
                {aggregate.paymentfailure}
              </p>
            </div>
            <div className="h-52 flex mt-10 flex-col items-center justify-center w-72 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>SUCCESS PAYMENTS COUNT</p>
              </div>
              <p className="font-bold text-4xl mt-4  text-green-800">
                {aggregate.paymentsuccess}
              </p>
            </div>
            <div className="h-52 mt-10 flex flex-col items-center justify-center w-72 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="text-xs font-bold  flex justify-evenly w-full">
                <img
                  className="bg-blue-500 p-1 rounded-lg"
                  src="/dashboard/school.png"
                />
                <p>CUMULATIVE TUROVER</p>
              </div>
              <p className="font-bold text-4xl mt-4  text-green-800">
                {aggregate.totalamount}
              </p>
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
                margin={{ top: 10, bottom: 30, left: 52, right: 10 }}
              />
            </div>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1, md: 3 }}
            >
              <div className="flex items-center justify-center text-xs">
                <h2 className="text-sm font-semibold mb-2">
                  COURSE COMPLETION
                </h2>
                <Gauge
                  width={100}
                  height={100}
                  value={aggregate.users}
                  // startAngle={ ? -90 : 0}
                  // endAngle={index === 1 ? 90 : 360}
                />
              </div>
              <div className="flex items-center justify-center text-xs">
                <h2 className="text-sm font-semibold mb-2">USER COUNT</h2>
                <Gauge
                  width={100}
                  height={100}
                  value={aggregate.users}
                  // startAngle={ ? -90 : 0}
                  // endAngle={index === 1 ? 90 : 360}
                />
              </div>
            </Stack>
          </div>
          {/* My Courses Section */}
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
