import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';
import DashboardTopbar from '../../components/DashboardTopbar';
import { BarChart, Gauge } from '@mui/x-charts';
import axiosInstance from '../../helper/axiosInstance';
import { courseProps } from '../../types/courseProps';
import { reviewProps } from '../../types/reviewProps';
import url from '../../helper/backendUrl';
import { format } from 'date-fns';

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

interface dashboardProps {
  courses: courseProps[];
  reviews: reviewProps[];
  completedReviews: reviewProps[];
  points: number;
}

export default function Dashboard(): ReactElement {
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
        const response = (await axiosInstance.get('/user/dashboard')).data;
        if (response.message === 'success') {
          setAggregate({
            reviews: response.reviews ?? [],
            completedReviews: response.completedreviews ?? [],
            courses: response.courses ?? [],
            points: response.points ?? 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAnalytics();
    registerServiceWorker();
    dispatch(setPage('dashboard'));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <DashboardTopbar />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">DASHBOARD</h1>
        
        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-4">OVERVIEW</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'COMPLETED REVIEWS', value: aggregate.completedReviews.length },
              { title: 'PENDING REVIEWS', value: aggregate.reviews.length },
              { title: 'WALLET BALANCE', value: aggregate.points },
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <img className="bg-blue-500 p-1 rounded-lg mr-2" src="/dashboard/school.png" alt="" />
                  <p className="text-xs font-bold">{item.title}</p>
                </div>
                <p className="font-bold text-2xl md:text-3xl">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-4">STUDY STATISTICS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <BarChart
                series={[
                  { data: [35, 44, 24, 34] },
                  { data: [51, 6, 49, 30] },
                  { data: [15, 25, 30, 50] },
                  { data: [60, 50, 15, 25] },
                ]}
                height={290}
                // width={400}
                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Course Completion Rate', 'Progress Rate'].map((label, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">{label}</h3>
                  <Gauge
                    width={100}
                    height={100}
                    value={60}
                    startAngle={index === 1 ? -90 : 0}
                    endAngle={index === 1 ? 90 : 360}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-4">MY COURSES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aggregate.courses.map((course) => (
              <div key={course._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <img
                  className="h-32 w-32 rounded-xl object-cover mb-2"
                  src={`${url}/course/${course.courseImage}`}
                  alt={course.courseName}
                />
                <p className="text-xs text-gray-500">{format(new Date(course.postedDate), 'PPp')}</p>
                <h3 className="text-lg font-semibold mt-2">{course.courseName}</h3>
                <p className="text-sm text-center mt-1">{course.courseDescription}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}