import { ReactElement, useEffect, useState } from 'react';
import { reviewProps } from '../../types/reviewProps';
import axiosInstance from '../../helper/axiosInstance';
import DashboardTopbar from '../../components/DashboardTopbar';

import 'react-calendar/dist/Calendar.css';
import SmallCalendar from 'react-calendar';
import {
  Calendar,
  DateLocalizer,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer: DateLocalizer = momentLocalizer(moment);

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
//given in the big calendar
interface bigCalendarProps {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export default function Review(): ReactElement {
  const [reviews, setReviews] = useState<Array<reviewProps>>([]);
  const [date, setDate] = useState<Value>(new Date());
    const [select,setSelect]=useState<boolean>(false)
  useEffect(() => {
    async function reviewFetching() {
      const response = (await axiosInstance.get('/user/review')).data;
      if (response.message === 'success') {
        console.log(response);
        setReviews(response.reviews);
      }
    }
    async function completionFetcher(){

    }
    completionFetcher()
    reviewFetching();
  }, []);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(slotInfo.start);
  };
  return (
    <>
      <DashboardTopbar />
      <h1 className="text-4xl ml-36">REVIEW</h1>
      <h1 className="text-xl font-light mt-10 ml-36">Scheduled Reviews</h1>
      {/* review history module for the user reviews that they have scheduled */}
      <div className=" w-full mr-40 h-40 border border-gray-400 flex items-center justify-center"></div>
      <h1 className="text-xl font-light mt-10 ml-36">Schedule Reviews</h1>
      <div className="flex items-center justify-center">
        {
            select ?
            <Calendar
            localizer={localizer}
            // events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            style={{ height: 600, width: 900, margin: '50px' }}
            selectable={true}
            />
            :
            <div className='flex items-center justify-evenly'>
                <button onClick={()=>setSelect(true)}>select</button>
            </div>
        }
      </div>
    </>
  );
}
