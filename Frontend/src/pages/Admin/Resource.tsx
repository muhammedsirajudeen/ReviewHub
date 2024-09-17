import axios from 'axios';
import {  ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import url from '../../helper/backendUrl';
import {  QuizProps, resourceProps, sectionProps } from '../../types/courseProps';

export default function Resource(): ReactElement {
  const [resource, setResource] = useState<resourceProps>();
  const { chapterId, quizStatus } = useLocation().state;
  const [active, setActive] = useState<string>('');
  const [activeresource, setActiveresource] = useState<sectionProps>();
  const [quiz,setQuiz]=useState<QuizProps>()
  useEffect(() => {
    async function dataWrapper() {
    if(!quizStatus){
        const response = (
          await axios.get(`${url}/admin/resource/${chapterId}`, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
          })
        ).data;
        //   console.log(response.resource)
        if (response.resource) {
          setResource(response.resource);
          setActive(response.resource?.Section[0].sectionName);
          setActiveresource(response.resource?.Section[0]);
        } else {
          setResource(undefined);
        }
      }else{
        //it is quiz
        const response = (
            await axios.get(`${url}/admin/quiz/${chapterId}`, {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
              },
            })
          ).data;
          if (response.quiz) {
            setQuiz(response.quiz)
          } else {
            setQuiz(undefined);
          }
      }
    }
    dataWrapper();
  }, [chapterId, quizStatus]);
  const activeHandler = (section: sectionProps) => {
    setActive(section.sectionName);
    setActiveresource(section);
  };

  return (
    <div className="ml-36 flex items-center justify-start">
      {!quizStatus ? (
        <>
          <div id="lesson-container" className="h-screen w-1/4 flex-col mt-10">
            <h1 className="text-lg text-gray-400">Lessons</h1>
            <div className="w-3/4 h-10 flex items-center justify-start p-3 shadow-lg mt-4 font-bold">
              {resource?.chapterName}
            </div>
            {resource?.Section.map((section) => {
              return (
                <div
                  onClick={() => activeHandler(section)}
                  key={section.sectionName}
                  className={`${
                    active === section.sectionName
                      ? 'bg-blue-500 text-white font-bold'
                      : ''
                  } w-3/4 h-auto flex-col p-3 flex items-start justify-center shadow-lg mt-4`}
                >
                  {section.sectionName}
                </div>
              );
            })}
          </div>
          <div className="w-full flex flex-col items-center h-screen justify-start mt-20">
            <h1 className="text-3xl text-gray-500">
              {activeresource?.sectionName}
            </h1>
            {activeresource?.content.map((content) => {
              return (
                <div
                  key={content.subheading}
                  className="flex w-full flex-col items-start justify-start mt-10"
                >
                  <h1 className="text-xl font-bold">{content.subheading}</h1>
                  <p className="text-lg font-light">{content.article}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        
        <div className='flex items-center justify-center flex-col'>
           <h1 className='text-3xl w-full text-gray-500 mt-4'>{quiz?.chapterName}</h1>
           {
            quiz?.Quiz.map((quiz)=>{
                return (
                    <div className='w-3/4 text-3xl h-auto flex-col mt-10'>
                        <h1 className='text-black text-xl'>{quiz.question}</h1>
                        <div className='flex items-center justify-start'>
                            <img src='/quiz/reward.png'/>
                            <p className='text-xs align-middle font-bold text-green-500' >{quiz.reward} + pts </p>
                        </div>
                        <form  className='flex flex-col items-start justify-center' >
                        {
                            quiz.options.map((option)=>{
                                return(
                                    <div className='flex items-center justify-start mt-2' >
                                        <input className='mr-4' name={quiz.question}  type='radio' key={option} value={option}/>
                                        <p className='text-lg text-gray-500' >{option}</p>
                                    </div>                                         

                                )
                            })
                        }
                        <button className='text-xs bg-blue-600 text-white  border  rounded-lg p-2 mt-10 '  type='submit'>check</button>
                        </form>
                    </div>

                )
            })
           }
        </div>
      )}
    </div>
  );
}
