import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import url from '../../helper/backendUrl';
import { QuizProps, resourceProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';

export default function Resource(): ReactElement {
  const { roadmapId } = useLocation().state;
  const [resources, setResources] = useState<Array<resourceProps>>([]);
  const [quizes, setQuizes] = useState<Array<QuizProps>>([]);
  const [active,setActive]=useState<string>("")
  console.log(roadmapId);
  useEffect(() => {
    async function dataWrapper() {
      const response = (
        await axios.get(`${url}/user/resource/${roadmapId}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        })
      ).data;
      if (response.message === 'success') {
        setResources(response.resource);
        setQuizes(response.quiz);
      } else {
        toast('unknown error');
      }
    }
    dataWrapper();
  }, [roadmapId]);
  return (
    <div className="ml-36 flex items-center justify-start">
      <div className="w-1/4 h-screen flex flex-col mt-10">
        <h1 className="text-3xl text-gray-400 font-bold ">Lessons</h1>
        {resources.map((resource) => {
          return (
            <div onClick={()=>setActive(resource.chapterName)} className={`${active===resource.chapterName && "bg-blue-500 text-white"} h-20 w-3/4 shadow-xl flex items-center justify-start mt-4`}>
              <h1 className="text-lg ml-2 font-bold">{resource.chapterName}</h1>
            </div>
          );
        })}
        {quizes.map((quiz) => {
          return (
            <div onClick={()=>setActive(quiz.chapterName)} className={`${active===quiz.chapterName && "bg-blue-500 text-white"} h-20 w-3/4 shadow-xl flex items-center justify-start mt-4`}>
              <h1 className="text-lg ml-2 font-bold">{quiz.chapterName}</h1>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}
