import { ReactElement, useEffect, useRef, useState } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import url from '../../helper/backendUrl';
import { roadmapProps } from '../../types/courseProps';
import ReviewDelete from '../../components/Form/Review/ReviewDelete';
import { flushSync } from 'react-dom';
import { produce } from 'immer';
import { useAppDispatch } from '../../store/hooks';
import { setPage } from '../../store/globalSlice';

const localizer: DateLocalizer = momentLocalizer(moment);

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Review(): ReactElement {
  const [reviews, setReviews] = useState<Array<reviewProps>>([]);
  const [pendingreviews, setPendingreviews] = useState<Array<reviewProps>>([]);
  const [date, setDate] = useState<Date>();
  const [select, setSelect] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<roadmapProps>();
  const [review, setReview] = useState<reviewProps>();
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [deletedialog, setDeletedialog] = useState<boolean>(false);
  const dispatch=useAppDispatch()
  useEffect(() => {
    dispatch(setPage('review'))
    async function reviewFetching() {
      const response = (await axiosInstance.get('/user/review')).data;
      if (response.message === 'success') {
        setReviews(response.reviews);
      }
    }
    async function requestedFetcher() {
      try {
        const response = (await axiosInstance.get('/user/review/roadmaps'))
          .data;
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
  }, [dispatch]);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(slotInfo.start);
    setDate(new Date(slotInfo.start));
  };

  const selectRoadmap = (roadmap: roadmapProps) => {
    setSelect(true);
    setRoadmap(roadmap);
  };
  const reviewScheduler = async () => {
    if (!date) {
      toast.error('Please select a date first');
      return;
    }
    try {
      const response = (
        await axiosInstance.put(`/user/review/schedule/${roadmap?._id}`, {
          date: date,
        })
      ).data;
      if (response.message === 'success') {
        console.log(response)
        toast.success('scheduled successfully');
        setPendingreviews(produce((draft)=>{
            return(
                draft.filter((d)=>d._id===review?._id)
            )
        }))
        //get from client side
        setReviews(produce((draft)=>{

                draft.push(response.reviews)
            
        }))
        setSelect(false)
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.message);
    }
  };
  const cancelHandler = (review: reviewProps) => {
    flushSync(()=>{
        setDeletedialog(true)
    })
    deleteDialogRef.current?.showModal()
    setReview(review);

  };
  const deleteCloseHandler=()=>{
    setDeletedialog(false)
    deleteDialogRef.current?.close()
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
          <div className="w-full h-72 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg shadow-sm bg-gray-100">
            {reviews.length === 0 && (
              <p className="text-gray-500">No scheduled reviews yet.</p>
            )}
            {reviews.map((review) => {
              return (
                <div key={review._id} className="flex flex-col items-center justify-start">
                  <img
                    className="h-20 w-20 rounded-lg"
                    src={`${url}/roadmap/${review.roadmapId.roadmapImage}`}
                    alt={review.roadmapId.roadmapName}
                  />
                  <p className="text-xs mt-2 font-semibold">
                    {review.roadmapId.roadmapName}
                  </p>

                  {/* Format the scheduled date */}
                  <div className="flex flex-col items-center mt-2">
                    <p className="text-xs text-gray-600">
                      {new Date(review.scheduledDate).toLocaleDateString(
                        'en-US',
                        { month: 'long', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(review.scheduledDate).toLocaleTimeString(
                        'en-US',
                        { hour: '2-digit', minute: '2-digit', hour12: true }
                      )}
                    </p>
                  </div>
                  <button
                    className="bg-red-700 text-white p-1 text-xs mt-4"
                    onClick={() => cancelHandler(review)}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
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
                  {date ? (
                    <div className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
                      <div className="text-lg font-semibold text-gray-800">
                        {date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-md text-gray-600">
                        {date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>
                  ) : null}
                  <button
                    className="bg-black text-white p-1 rounded-lg"
                    onClick={reviewScheduler}
                  >
                    confirm
                  </button>
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
        <ToastContainer
          style={{
            backgroundColor: 'gray',
            color: 'white',
            borderRadius: '10px',
          }}
        />
      </div>
      {
        deletedialog && (
            <ReviewDelete setReviews={setReviews} review={review} dialogRef={deleteDialogRef} closeHandler={deleteCloseHandler}/>
        )
      }
    </>
  );
}
