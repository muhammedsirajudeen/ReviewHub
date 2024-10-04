import { ReactElement, useEffect, useState } from 'react';
import { reviewProps } from '../../types/reviewProps';
import axiosInstance from '../../helper/axiosInstance';
import DashboardTopbar from '../../components/DashboardTopbar';

import 'react-calendar/dist/Calendar.css';
import {
  Calendar,
  DateLocalizer,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import url from '../../helper/backendUrl';
import { roadmapProps } from '../../types/courseProps';

const localizer: DateLocalizer = momentLocalizer(moment);

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Review(): ReactElement {
  const [reviews, setReviews] = useState<Array<reviewProps>>([]);
  const [pendingreviews, setPendingreviews] = useState<Array<reviewProps>>([]);
  const [date, setDate] = useState<Date>();
  const [select, setSelect] = useState<boolean>(false);
  const [roadmap,setRoadmap]=useState<roadmapProps>()

  useEffect(() => {
    async function reviewFetching() {
      const response = (await axiosInstance.get('/user/review')).data;
      if (response.message === 'success') {
        setReviews(response.reviews);
      }
    }
    async function requestedFetcher() {
      try {
        const response = (await axiosInstance.get('/user/review/roadmaps')).data;
        if (response.message === 'success') {
          console.log(response);
          setPendingreviews(response.requested);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        toast.error(axiosError.status);
      }
    }
    requestedFetcher();
    reviewFetching();
  }, []);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(slotInfo.start);
    setDate(new Date(slotInfo.start))
  };

  const selectRoadmap = (roadmap: roadmapProps) => {
    setSelect(true);
    setRoadmap(roadmap)
  };
  const reviewScheduler=async ()=>{
    try{
        const response=(
            await axiosInstance.post('/review/schedule',
                {
                    date:date
                }
            )
        ).data
        if(response.message==="success"){
            toast.success("scheduled successfully")
        }
    }catch(error){
        const axiosError=error as AxiosError
        toast.error(axiosError.message)
    }
  }

  return (
    <>
      <DashboardTopbar />
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-semibold text-gray-800 mb-6">
          Review Scheduling
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 text-gray-700">
            Scheduled Reviews
          </h2>
          <div className="w-full h-40 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg shadow-sm bg-gray-100">
            <p className="text-gray-500">No scheduled reviews yet.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-light mb-6 text-gray-700">
            Schedule Reviews
          </h2>

          <div className="flex items-center justify-center">
            {select ? (
              <>
                <div
                  key={roadmap?._id}
                  className="w-60 flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                >
                  <img
                    className="w-full h-40 object-cover"
                    src={`${url}/roadmap/${roadmap?.roadmapImage}`}
                    alt={roadmap?.roadmapName}
                  />
                  <div className="p-4">
                    <p className="font-bold text-lg text-gray-800">
                      {roadmap?.roadmapName}
                    </p>

                  </div>
                {
                    date?.toISOString()
                }
                <button onClick={reviewScheduler} ></button>
                </div>
                <Calendar
                  localizer={localizer}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  style={{ height: 600, width: 900, margin: '50px' }}
                  selectable={true}
                  className="shadow-lg rounded-lg border border-gray-200"
                />
              </>
            ) : (
              <div className="flex items-center justify-evenly w-full flex-wrap gap-8">
                {pendingreviews.map((pendingreview) => (
                  <div
                    key={pendingreview.roadmapId._id}
                    className="w-60 flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                  >
                    <img
                      className="w-full h-40 object-cover"
                      src={`${url}/roadmap/${pendingreview.roadmapId.roadmapImage}`}
                      alt={pendingreview.roadmapId.roadmapName}
                    />
                    <div className="p-4">
                      <p className="font-bold text-lg text-gray-800">
                        {pendingreview.roadmapId.roadmapName}
                      </p>
                      <button
                        className="mt-4 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => selectRoadmap(pendingreview.roadmapId)}
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
