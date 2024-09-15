import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { courseProps } from "../types/courseProps";
import axios from "axios";
import url from "../helper/backendUrl";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];



export default function FilterBar({
  setResult,
  currentpage,
}: {
  currentpage: number;
  setResult: Dispatch<SetStateAction<Array<courseProps>>>;
}): ReactElement {
  const [active, setActive] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [date, setDate] = useState<Value>(new Date());
  const [selectdate, setSelectdate] = useState<boolean>(false);
  //try to refactor this piece of code
  useEffect(() => {
    if (selectdate && domain) {
      async function dataWrapper() {
        const response = (
          await axios.get(
            url +
              `/user/course?page=${currentpage}&date=${date}&domain=${domain}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
              },
            }
          )
        ).data;
        setResult(response.courses);
      }
      dataWrapper();
    } else if (domain) {
      async function dataWrapper() {
        const response = (
          await axios.get(
            url + `/user/course?page=${currentpage}&domain=${domain}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
              },
            }
          )
        ).data;
        setResult(response.courses);
      }
      dataWrapper();
    } else if (selectdate) {
      async function dataWrapper() {
        const response = (
          await axios.get(
            url + `/user/course?page=${currentpage}&date=${date}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
              },
            }
          )
        ).data;
        setResult(response.courses);
      }
      dataWrapper();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectdate, domain,date]);
  const domainHandler = (selection: string) => {
    if (active === 'domain') {
      setActive('');
    } else {
      setActive(selection);
    }
    // alert("domain handler")
  };
  const dateHandler = (selection: string) => {
    if (active === 'date') {
      setActive('');
    } else {
      setActive(selection);
    }
  };
  const categoryHandler = (selection: string) => {
    if (active === 'category') {
      setActive('');
    } else {
      setActive(selection);
    }
  };

  const domainSelector = (domain: string) => {
    setDomain(domain);
    setActive('');
  };
  const dateSelectHandler = (value: Value) => {
    setActive('');
    setSelectdate(true);
    setDate(value);
  };

  return (
    <>
      <div className="ml-36 flex items-center justify-evenly mt-4">
        <div className="flex flex-col items-center justify-center">
          <button
            className={`border border-black text-black p-2 rounded-lg flex items-center justify-center ${
              active === 'domain' ? 'bg-black text-white' : ''
            } `}
          >
            <span className="text-xs font-light">Domain</span>
            <img
              onClick={() => domainHandler('domain')}
              src={
                active === 'domain'
                  ? '/filterbar/up.png'
                  : '/filterbar/down.png'
              }
              className="h-3 w-3"
            />
          </button>
          {active === 'domain' && (
            <div className="absolute mt-28 h-20 w-20 bg-white border border-gray-400">
              <button
                onClick={() => domainSelector('Mern')}
                className="flex border border-gray-400 w-full items-center justify-center"
              >
                <p className="text-xs font-bold">Mern</p>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            className={`border border-black text-black p-2 rounded-lg flex items-center justify-center ${
              active === 'date' ? 'bg-black text-white' : ''
            } `}
          >
            <span className="text-xs font-light">Date</span>
            <img
              onClick={() => dateHandler('date')}
              src={
                active === 'date' ? '/filterbar/up.png' : '/filterbar/down.png'
              }
              className="h-3 w-3"
            />
          </button>
          {active === 'date' && (
            <div className="absolute mt-96">
              <Calendar onChange={dateSelectHandler} />
            </div>
          )}
        </div>

        <button
          className={`border border-black text-black p-2 rounded-lg flex items-center justify-center ${
            active === 'category' ? 'bg-black text-white' : ''
          } `}
        >
          <span className="text-xs font-light">Category</span>
          <img
            onClick={() => categoryHandler('category')}
            src={
              active === 'category'
                ? '/filterbar/up.png'
                : '/filterbar/down.png'
            }
            className="h-3 w-3"
          />
        </button>
        {domain && (
          <button className="bg-white border border-b-black ">{domain}</button>
        )}
        {selectdate && (
          <button className="bg-white border border-b-black">
            {date?.toString().split(' ').slice(0, 4).join(' ')}
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="border border-black text-black p-2 rounded-lg flex items-center justify-center text-xs font-light"
        >
          Clear all X
        </button>
      </div>

      <div className="w-full flex items-center justify-center">
        <hr className="  border border-gray-400 mt-4 w-3/4" />
      </div>
    </>
  );
}