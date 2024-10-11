import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { courseProps, domainProps } from "../types/courseProps";
import axiosInstance from "../helper/axiosInstance";

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
  const [domains,setDomains]=useState<domainProps[]>([])
  const [date, setDate] = useState<Value>(new Date());
  const [selectdate, setSelectdate] = useState<boolean>(false);
  const [favorite,setFavorite]=useState<boolean>(false)
  useEffect(()=>{
    const fetchDomains=async ()=>{
      const response=(
        await axiosInstance.get('/user/domain')
      ).data
      if(response.message==="success"){
        setDomains(response.domains)
      }
    }
    fetchDomains()
  },[])
  useEffect(() => {

    const fetchData = async (endpoint: string) => {
      const response = (
        await axiosInstance.get(endpoint)
      ).data;
      setResult(response.courses);
    };

    if (selectdate && domain && favorite ) {
      fetchData(`/user/course?page=${currentpage}&date=${date}&domain=${domain}&favorite=true`);
    } else if (domain) {
      fetchData(`/user/course?page=${currentpage}&domain=${domain}`);
    } else if (selectdate) {
      fetchData(`/user/course?page=${currentpage}&date=${date}`);
    }else if(favorite){
      fetchData(`/user/course?page=${currentpage}&favorite=true`);
    }
  }, [selectdate, domain, date, currentpage, setResult, favorite]);

  const toggleActive = (selection: string) => {
    setActive(prev => (prev === selection ? '' : selection));
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
  const favoriteSelector=()=>{
    setFavorite((prev)=>!prev)
  }

  return (
    <>
      <div className="flex items-center justify-evenly mt-4 px-8">
        {/* Domain Filter */}
        <div className="relative flex flex-col items-center">
          <button
            className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${active === 'domain' ? 'bg-gray-800 text-white' : ''}`}
            onClick={() => toggleActive('domain')}
          >
            <span className="text-xs font-light">Domain</span>
            <img
              src={active === 'domain' ? '/filterbar/up.png' : '/filterbar/down.png'}
              className="h-3 w-3 ml-2"
              alt="toggle"
            />
          </button>
          {active === 'domain' && (
            <div className="absolute mt-8 bg-white border border-gray-400 rounded shadow-lg">
              {
                //get all domains and display here
                domains.map((domain)=>{
              return (
                <button
                key={domain._id}
                  onClick={() => domainSelector(domain.domain)}
                  className="flex border-b border-gray-200 w-full items-center justify-center p-2 hover:bg-gray-100"
                >
                  
                  <p className="text-xs font-bold">{domain.domain}</p>
                </button>
              )                  
                })
              }
            </div>
          )}
        </div>

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
            <div className="absolute mt-2">
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
        <button
          className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 ${active === 'favorite' ? 'bg-gray-800 text-white' : ''}`}
          onClick={() => {toggleActive('favorite');favoriteSelector()}}
        >
          <span className="text-xs font-light">Favorite</span>
          <img
            src={active === 'category' ? '/filterbar/up.png' : '/filterbar/down.png'}
            className="h-3 w-3 ml-2"
            alt="toggle"
          />
        </button>

        {/* Selected Filters */}
        {domain && (
          <button className="bg-white border border-gray-300 rounded-lg px-3 py-1 shadow-md">
            {domain}
          </button>
        )}
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
