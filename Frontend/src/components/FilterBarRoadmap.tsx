import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { chapterProps, roadmapProps } from "../types/courseProps";
import axios from "axios";
import url from "../helper/backendUrl";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


export default function FilterBarRoadmap(
    {
        setRoadmaps,
        setChapters,
        type,
        courseId,
        currentpage,
        roadmapId
    }
    :{
        setRoadmaps?:Dispatch<SetStateAction<Array<roadmapProps>>>,
        setChapters?:Dispatch<SetStateAction<Array<chapterProps>>>,
        courseId?:string,
        currentpage:number,
        type:string,
        roadmapId?:string
    }

):ReactElement{
    const [active,setActive]=useState<string>("")
    const [selectdate,setSelectdate]=useState<boolean>(false)
    const [date, setDate] = useState<Value>(new Date());
    useEffect(()=>{
        if(selectdate){
            async function dataWrapper() {
                if(type==="roadmap"){
                    const response = (
                        await axios.get(
                            url +
                                `/user/roadmap/${courseId}?page=${currentpage}&date=${date}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${window.localStorage.getItem(
                                        'token'
                                    )}`,
                                },
                            }
                        )
                    ).data;
                    console.log(response)
                    if(setRoadmaps) setRoadmaps(response.roadmaps);
                }else if(type==="chapter"){
                    const response = (
                        await axios.get(
                            url +
                                `/admin/chapter/${roadmapId}?page=${currentpage}&date=${date}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${window.localStorage.getItem(
                                        'token'
                                    )}`,
                                },
                            }
                        )
                    ).data;
                    console.log(response)
                    if(setChapters) setChapters(response.chapters);  
                }
                // setPagecount(response.pageLength);
            }
            dataWrapper();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectdate])
    const dateHandler = (selection: string) => {
        if (active === 'date') {
          setActive('');
        } else {
          setActive(selection);
        }
      };
      const dateSelectHandler = (value: Value) => {
        setActive('');
        setSelectdate(true);
        setDate(value);
      };
    return(
        <>
        <div className="ml-36 flex items-center justify-evenly mt-4">

  
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
    )
}