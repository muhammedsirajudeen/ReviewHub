import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { chapterProps, roadmapProps } from "../types/courseProps";
import axiosInstance from "../helper/axiosInstance";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function FilterBarRoadmap({
    setRoadmaps,
    setChapters,
    type,
    courseId,
    currentpage,
    roadmapId
}: {
    setRoadmaps?: Dispatch<SetStateAction<Array<roadmapProps>>>,
    setChapters?: Dispatch<SetStateAction<Array<chapterProps>>>,
    courseId?: string,
    currentpage: number,
    type: string,
    roadmapId?: string
}): ReactElement {
    const [active, setActive] = useState<string>("");
    const [selectdate, setSelectdate] = useState<boolean>(false);
    const [date, setDate] = useState<Value>(new Date());

    useEffect(() => {
        if (selectdate) {
            async function dataWrapper() {
                const endpoint = type === "roadmap" 
                    ? `/user/roadmap/${courseId}?page=${currentpage}&date=${date}`
                    : `/admin/chapter/${roadmapId}?page=${currentpage}&date=${date}`;

                const response = (
                    await axiosInstance.get(endpoint)
                ).data;

                console.log(response);
                if (type === "roadmap" && setRoadmaps) {
                    setRoadmaps(response.roadmaps);
                } else if (type === "chapter" && setChapters) {
                    setChapters(response.chapters);
                }
            }
            dataWrapper();
        }
    }, [selectdate, courseId, currentpage, roadmapId, setChapters, setRoadmaps, type, date]);

    const dateHandler = (selection: string) => {
        setActive(prev => prev === selection ? '' : selection);
    };

    const dateSelectHandler = (value: Value) => {
        setActive('');
        setSelectdate(true);
        setDate(value);
    };

    return (
        <>
            <div className="ml-36 flex items-center justify-evenly mt-4">
                <div className="relative flex flex-col items-center">
                    <button
                        className={`border border-gray-300 text-gray-700 p-2 rounded-lg flex items-center justify-between transition-colors duration-300 hover:bg-gray-100 ${
                            active === 'date' ? 'bg-gray-800 text-white' : ''
                        }`}
                        onClick={() => dateHandler('date')}
                    >
                        <span className="text-xs font-light">Date</span>
                        <img
                            src={active === 'date' ? '/filterbar/up.png' : '/filterbar/down.png'}
                            className="h-3 w-3 transition-transform duration-300"
                        />
                    </button>
                    {active === 'date' && (
                        <div className="absolute z-10 mt-2">
                            <Calendar onChange={dateSelectHandler} />
                        </div>
                    )}
                </div>

                {selectdate && (
                    <button className="bg-white border border-gray-300 rounded-lg p-2 shadow-md">
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

            <div className="w-full flex items-center justify-center">
                <hr className="border border-gray-400 mt-4 w-3/4" />
            </div>
        </>
    );
}
