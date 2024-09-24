import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axiosInstance from "../../helper/axiosInstance";
import { blogProps } from "../../types/blogProps";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BlogFilterBar({
  setResult,
  currentpage,
}: {
  currentpage: number;
  setResult: Dispatch<SetStateAction<Array<blogProps>>>;
}): ReactElement {
  const [active, setActive] = useState<string>('');
  const [date, setDate] = useState<Value>(new Date());
  const [selectdate, setSelectdate] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async (endpoint: string) => {
      const response = (
        await axiosInstance.get(endpoint)
      ).data;
      setResult(response.blogs);
    };

    if (selectdate) {
      fetchData(`/user/blog?page=${currentpage}&date=${date}`);
    }
  }, [selectdate, date, currentpage, setResult]);

  const toggleActive = (selection: string) => {
    setActive(prev => (prev === selection ? '' : selection));
  };


  const dateSelectHandler = (value: Value) => {
    setActive('');
    setSelectdate(true);
    setDate(value);
  };

  return (
    <>
      <div className="flex items-center justify-evenly mt-4 px-8 z-10">
        {/* Domain Filter */}

        {/* Date Filter */}
        <div className="relative flex flex-col items-center">
          <button
            className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${active === 'date' ? 'bg-gray-800 text-white' : ''}`}
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
        <button
          className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${active === 'category' ? 'bg-gray-800 text-white' : ''}`}
          onClick={() => toggleActive('category')}
        >
          <span className="text-xs font-light">Category</span>
          <img
            src={active === 'category' ? '/filterbar/up.png' : '/filterbar/down.png'}
            className="h-3 w-3 ml-2"
            alt="toggle"
          />
        </button>
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
