import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { courseProps } from "../types/courseProps";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


export default function FilterBar(
  {
    setResult,
    courses
  }:{
    courses:Array<courseProps>,
    setResult:Dispatch<SetStateAction<Array<courseProps>>>
  }
):ReactElement{
    const [active,setActive]=useState<string>("")
    const [domain,setDomain]=useState<string>("")
    const [date, onChange] = useState<Value>(new Date());
    const [selectdate,setSelectdate]=useState<boolean>(false)
    useEffect(()=>{
        if(domain){
            console.log(courses)
            const filteredCourses=courses.filter((course)=>course?.domain.toLowerCase()===domain.toLowerCase())
            setResult(filteredCourses)
            // alert("hey")
        }else if(selectdate){
          alert("filter by date here")
        }
    },[selectdate,domain])
    const domainHandler=(selection:string)=>{
        
        if(active==="domain") {
            setActive("")
        }else{
            setActive(selection)

        }
        // alert("domain handler")
    }
    const dateHandler=(selection:string)=>{
        if(active==="date") {
            setActive("")
        }else{
            setActive(selection)

        }
    }
    const categoryHandler=(selection:string)=>{
        if(active==="category") {
            setActive("")
        }else{
            setActive(selection)

        }
    }

    const domainSelector=(domain:string)=>{
        setDomain(domain)
        setActive("")
    }
    const dateSelectHandler=()=>{
        setActive("")
        setSelectdate(true)
        return onChange
    }

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
                  onClick={() => domainSelector('mern')}
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
                  active === 'date'
                    ? '/filterbar/up.png'
                    : '/filterbar/down.png'
                }
                className="h-3 w-3"
              />
            </button>
            {active === 'date' && (
              <div className="absolute mt-96">
                <Calendar onChange={() => dateSelectHandler()} />
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
            {
                domain && (
                    <button className="bg-white border border-b-black ">{domain}</button>
                )
            }
            {
                selectdate &&
                (
                    <button className="bg-white border border-b-black">{date?.toString().split(' ').slice(0,4).join(' ')}</button>
                )
            }
          <button onClick={()=>window.location.reload()} className="border border-black text-black p-2 rounded-lg flex items-center justify-center text-xs font-light">
            Clear all X
          </button>
        </div>

        <div className="w-full flex items-center justify-center">
          <hr className="  border border-gray-400 mt-4 w-3/4" />
        </div>
      </>
    );
}