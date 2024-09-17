import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import url from '../../helper/backendUrl';
import {  resourceProps, sectionProps } from '../../types/courseProps';

export default function Resource(): ReactElement {
  const [resource, setResource] = useState<resourceProps>();
  const { chapterId } = useLocation().state;
  const [active,setActive]=useState<string>("")
  const [activeresource,setActiveresource]=useState<sectionProps>()
  useEffect(() => {
    async function dataWrapper() {
      const response = (
        await axios.get(`${url}/user/resource/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        })
      ).data;
    //   console.log(response.resource)
    if(response.resource) {
        setResource(response.resource)
        setActive(response.resource?.Section[0].sectionName)
        setActiveresource(response.resource?.Section[0])
    }else{
        setResource(undefined)
    }

    }
    dataWrapper();
  }, [chapterId]);
  const activeHandler=(section:sectionProps)=>{
    setActive(section.sectionName)
    setActiveresource(section)
  }
  return (
    <div className="ml-36 flex items-center justify-start">
      <div id='lesson-container' className="h-screen w-1/4 flex-col mt-10">
        <h1 className="text-lg text-gray-400">Lessons</h1>
        <div className="w-3/4 h-10 flex items-center justify-start p-3 shadow-lg mt-4 font-bold">
          {resource?.chapterName}
        </div>
        {resource?.Section.map((section) => {
          return (
            <div onClick={()=>activeHandler(section)} key={section.sectionName} className={`${active === section.sectionName ? "bg-blue-500 text-white font-bold" : "" } w-3/4 h-auto flex-col p-3 flex items-start justify-center shadow-lg mt-4`}>
              {section.sectionName}
            </div>
          );
        })}
      </div>
        <div className='w-full flex flex-col items-center h-screen justify-start mt-20'>
            <h1 className='text-3xl text-gray-500'>{activeresource?.sectionName}</h1>
            {
                activeresource?.content.map((content)=>{
                    return (
                        <div key={content.subheading} className='flex w-full flex-col items-start justify-start mt-10'>
                            <h1 className='text-xl font-bold' >{content.subheading}</h1>
                            <p className='text-lg font-light'>{content.article}</p>
                        </div>
                    )
                })
            }
        </div>
    </div>
  );
}
