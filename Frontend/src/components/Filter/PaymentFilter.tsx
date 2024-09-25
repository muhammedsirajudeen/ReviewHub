import { ReactElement, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAppDispatch } from '../../store/hooks';
import { setDateSlice, setStatus } from '../../store/globalSlice';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function PaymentFilterBar({
  currentpage,
}: {
  currentpage: number;
}): ReactElement {
  const [active, setActive] = useState<string>('');
  const [date, setDate] = useState<Value>(new Date());
  const [selectdate, setSelectdate] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectdate && date) {
      dispatch(setDateSlice(date));
      console.log(selectdate);
    }
  }, [selectdate, date, currentpage, dispatch]);

  const toggleActive = (selection: string) => {
    setActive((prev) => (prev === selection ? '' : selection));
  };

  const dateSelectHandler = (value: Value) => {
    setActive('');
    setSelectdate(true);
    setDate(value);
  };

  return (
    <>
      <div className="flex items-center justify-evenly mt-4 px-8">
        {/* Date Filter */}
        <div className="relative flex flex-col items-center">
          <button
            className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${
              active === 'date' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => toggleActive('date')}
          >
            <span className="text-xs font-light">Date</span>
            <img
              src={active === 'date' ? '/filterbar/up.png' : '/filterbar/down.png'}
              className="h-3 w-3 ml-2"
              alt="toggle"
            />
          </button>
          {active === 'date' && (
            <div className="absolute mt-2 z-10">
              <Calendar onChange={dateSelectHandler} />
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative flex flex-col items-center">
          <button
            className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${
              active === 'category' ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => toggleActive('category')}
          >
            <span className="text-xs font-light">Category</span>
            <img
              src={active === 'category' ? '/filterbar/up.png' : '/filterbar/down.png'}
              className="h-3 w-3 ml-2"
              alt="toggle"
            />
          </button>
          {active === 'category' && (
            <div className="absolute top-12 flex flex-col p-2 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              <button
                onClick={() => {
                  toggleActive('category');
                  dispatch(setStatus(true));
                }}
                className="bg-green-200 p-1 rounded-xl transition duration-200 hover:bg-green-300"
              >
                <p className="text-green-700 font-bold">Success</p>
              </button>
              <button
                onClick={() => {
                  toggleActive('category');
                  dispatch(setStatus(false));
                }}
                className="bg-red-200 p-1 rounded-xl mt-2 transition duration-200 hover:bg-red-300"
              >
                <p className="text-red-700 font-bold">Failure</p>
              </button>
            </div>
          )}
        </div>

        {/* Selected Filters */}
        {selectdate && (
          <button className="bg-white border border-gray-300 rounded-lg px-3 py-1 shadow-md">
            {date?.toString().split(' ').slice(0, 4).join(' ')}
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center text-xs font-light hover:bg-gray-100 transition-colors duration-300"
        >
          Clear all X
        </button>
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <hr className="border border-gray-400 w-3/4" />
      </div>
    </>
  );
}
