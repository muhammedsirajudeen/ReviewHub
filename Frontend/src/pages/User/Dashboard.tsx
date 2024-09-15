import { ReactElement, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPage } from "../../store/globalSlice";
import DashboardTopbar from "../../components/DashboardTopbar";
import { BarChart, Gauge } from "@mui/x-charts";
import { Stack } from "@mui/material";

export default function Dashboard(): ReactElement {
  const dispatch = useAppDispatch();
  console.log("component rendered")
  useEffect(() => {
    dispatch(setPage("dashboard"));
  }, [dispatch]);
  return (
    <>
      <DashboardTopbar />
      <p className="flex ml-36 text-3xl font-bold w-full items-center justify-start">
        DASHBOARD
      </p>
      <div className="w-full flex items-center justify-center ml-36">
        <div className="w-3/4 flex flex-col items-center justify-start mt-4">
          <h1 className="text-2xl font-bold text-gray-500 w-full">OVERVIEW</h1>
          {/* the overview container here */}
          <div className="flex justify-evenly w-full items-center">
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl">
              <div className="text-xs font-bold flex justify-evenly w-full">
                <img className="bg-blue-500" src="/dashboard/school.png" />
                <p>COURSES IN PROGRESS</p>
              </div>
              {/* result here */}
              <p className="font-bold text-4xl mt-4">4</p>
            </div>
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl">
              <div className="text-xs font-bold flex justify-evenly w-full">
                <img className="bg-blue-500" src="/dashboard/school.png" />
                <p>COURSES IN PROGRESS</p>
              </div>
              {/* result here */}
              <p className="font-bold text-4xl mt-4">4</p>
            </div>
            <div className="h-40 flex flex-col items-center justify-center w-52 shadow-xl">
              <div className="text-xs font-bold flex justify-evenly w-full">
                <img className="bg-blue-500" src="/dashboard/school.png" />
                <p>COURSES IN PROGRESS</p>
              </div>
              {/* result here */}
              <p className="font-bold text-4xl mt-4">4</p>
            </div>
          </div>
          {/* study statistics here */}
          <h1 className="font-bold text-gray-500 text-2xl w-full mt-10 ">
            STUDY STATISTICS
          </h1>
          <div className="mt-4 flex items-center justify-between w-full">
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
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1, md: 3 }}
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Course Completion Rate
                </h2>
                <Gauge width={100} height={100} value={60} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Progress Rate</h2>
                <Gauge
                  width={100}
                  height={100}
                  value={60}
                  startAngle={-90}
                  endAngle={90}
                />
              </div>
            </Stack>
          </div>
          {/* here an overview of the courses that the user has enrolled in */}
          <h1 className="mt-4 text-2xl font-bold w-full  text-gray-500">MY COURSES</h1>
          {/* this div is to give the courses that the user has enrolled in */}
          <div>

          </div>
        </div>
        {/* in here we add some more basic analytics */}
        <div className="w-1/2 flex items-center justify-center mt-4">right container</div>
      </div>
    </>
  );
}
