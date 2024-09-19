import { ReactElement, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

const data = [
  {
    id: 'data-0',
    x1: 329.39,
    x2: 391.29,
    y1: 443.28,
    y2: 153.9,
  },
  {
    id: 'data-1',
    x1: 96.94,
    x2: 139.6,
    y1: 110.5,
    y2: 217.8,
  },
  {
    id: 'data-2',
    x1: 336.35,
    x2: 282.34,
    y1: 175.23,
    y2: 286.32,
  },
  {
    id: 'data-3',
    x1: 159.44,
    x2: 384.85,
    y1: 195.97,
    y2: 325.12,
  },
  {
    id: 'data-4',
    x1: 188.86,
    x2: 182.27,
    y1: 351.77,
    y2: 144.58,
  },
  {
    id: 'data-5',
    x1: 143.86,
    x2: 360.22,
    y1: 43.253,
    y2: 146.51,
  },
  {
    id: 'data-6',
    x1: 202.02,
    x2: 209.5,
    y1: 376.34,
    y2: 309.69,
  },
  {
    id: 'data-7',
    x1: 384.41,
    x2: 258.93,
    y1: 31.514,
    y2: 236.38,
  },
  {
    id: 'data-8',
    x1: 256.76,
    x2: 70.571,
    y1: 231.31,
    y2: 440.72,
  },
  {
    id: 'data-9',
    x1: 143.79,
    x2: 419.02,
    y1: 108.04,
    y2: 20.29,
  },
  {
    id: 'data-10',
    x1: 103.48,
    x2: 15.886,
    y1: 321.77,
    y2: 484.17,
  },
  {
    id: 'data-11',
    x1: 272.39,
    x2: 189.03,
    y1: 120.18,
    y2: 54.962,
  },
  {
    id: 'data-12',
    x1: 23.57,
    x2: 456.4,
    y1: 366.2,
    y2: 418.5,
  },
  {
    id: 'data-13',
    x1: 219.73,
    x2: 235.96,
    y1: 451.45,
    y2: 181.32,
  },
  {
    id: 'data-14',
    x1: 54.99,
    x2: 434.5,
    y1: 294.8,
    y2: 440.9,
  },
  {
    id: 'data-15',
    x1: 134.13,
    x2: 383.8,
    y1: 121.83,
    y2: 273.52,
  },
  {
    id: 'data-16',
    x1: 12.7,
    x2: 270.8,
    y1: 287.7,
    y2: 346.7,
  },
  {
    id: 'data-17',
    x1: 176.51,
    x2: 119.17,
    y1: 134.06,
    y2: 74.528,
  },
  {
    id: 'data-18',
    x1: 65.05,
    x2: 78.93,
    y1: 104.5,
    y2: 150.9,
  },
  {
    id: 'data-19',
    x1: 162.25,
    x2: 63.707,
    y1: 413.07,
    y2: 26.483,
  },
  {
    id: 'data-20',
    x1: 68.88,
    x2: 150.8,
    y1: 74.68,
    y2: 333.2,
  },
  {
    id: 'data-21',
    x1: 95.29,
    x2: 329.1,
    y1: 360.6,
    y2: 422.0,
  },
  {
    id: 'data-22',
    x1: 390.62,
    x2: 10.01,
    y1: 330.72,
    y2: 488.06,
  },
];

export default function AdminDashboard(): ReactElement {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPage("dashboard"));
  }, [dispatch]);

  return (
    <>
      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <p className="mb-8 text-lg text-gray-700 text-center">
          Welcome to the admin dashboard. Here, you can review user activities, track performance,
          and monitor the progress of programming courses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Quarterly Performance Overview</h2>
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

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Course Engagement Breakdown</h2>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Beginner' },
                    { id: 1, value: 15, label: 'Intermediate' },
                    { id: 2, value: 20, label: 'Advanced' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
          </div>

        </div>
          <h2 className="text-2xl font-semibold mb-4 text-center w-full ">User Growth Over Time</h2>
          <div className="bg-white  p-6 flex items-center justify-center w-full rounded-lg shadow-lg">
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />
          </div>

        <div className="mt-10 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-semibold text-center mb-4">Data Visualizations</h2>
          <ScatterChart
            width={600}
            height={300}
            series={[
              {
                label: 'Performance Metrics',
                data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
              },
              {
                label: 'Benchmark Data',
                data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
              },
            ]}
          />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            className="mt-6"
            justifyContent="center"
          >
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Course Completion Rate</h2>
              <Gauge width={100} height={100} value={60} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">User Retention</h2>
              <Gauge width={100} height={100} value={60} startAngle={-90} endAngle={90} />
            </div>
          </Stack>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
