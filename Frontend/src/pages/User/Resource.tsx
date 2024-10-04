import { FormEvent, Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { QuizProps, resourceProps, responseProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';
import QuizCheck from '../../components/Form/Resource/user/QuizCheck';
import { flushSync } from 'react-dom';
import ConfettiExplosion from 'react-confetti-explosion';
import axiosInstance from '../../helper/axiosInstance';
import { AxiosError } from 'axios';

export default function Resource(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Array<resourceProps>>([]);
  const [activeresource, setactiveResource] = useState<resourceProps>();
  const [activequiz, setActivequiz] = useState<QuizProps>();
  const [quizes, setQuizes] = useState<Array<QuizProps>>([]);
  const [active, setActive] = useState<string>('');
  const [responseData,setResponseData]=useState<responseProps[]>([])
  const [finalReward,setFinalReward]=useState<number>(0)
  const [type, setType] = useState<string>('');
  const [result,setResult]=useState<boolean>(false)
  const resultdialogRef=useRef<HTMLDialogElement>(null)
  
  useEffect(() => {
    if (!location.state) {
      navigate('/user/courses');
      return;
    }
    async function dataWrapper() {
      const response = (
        await axiosInstance.get(`/user/resource/${location.state.roadmapId}`)
      ).data;
      if (response.message === 'success') {
        setResources(response.resource);
        setActive(response.resource[0].chapterName);
        setactiveResource(response.resource[0]);
        setType('resource');
        setQuizes(response.quiz);
      } else {
        toast('unknown error');
      }
    }
    dataWrapper();
  }, [location.state, navigate]);
  const resourceHandler = (resource: resourceProps) => {
    console.log(resource);
    setActive(resource.chapterName);
    setactiveResource(resource);
    setType('resource');
  };
  const quizHandler = (quiz: QuizProps) => {
    setActive(quiz.chapterName);
    setActivequiz(quiz);
    setType('quiz');
  };
  //checking the quiz here
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let flag = true;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formValues: Record<string, string> = {};
    formData.forEach((value, key) => {
      flag = false;
      formValues[key] = value as string;
    });
    if (flag) {
      toast('please answer all questions before submitting');
    }else{
      try{
        const response=(
          await axiosInstance.post(`/user/quiz/check/${activequiz?._id}`,
            formValues,
          )
        ).data
        if(response.message==="success"){
          toast("success")

          setResponseData(response.result)
          setFinalReward(response.finalReward)
          flushSync(()=>{
            setResult(true)
          })
          resultdialogRef.current?.showModal()
          //set quiz success modal here
        }else{
          toast(response.message)
        }
      }catch(error){
        console.log(error)
        toast("error occured")
      }
    }
  };

  const resultCloseHandler=()=>{
    resultdialogRef.current?.close()
    setResult(false)
  }
  const reviewRequestHandler=async ()=>{
    try{
      const response=(await axiosInstance.post(`/user/review/request/${location.state.roadmapId}`)).data
      if(response.message==="success"){
        toast.success("requested successfully")
        setTimeout(()=>{

          navigate('/user/review')
        },1000)
      }
    }catch(error){
      const axiosError=error as AxiosError
      
      console.log(axiosError)
      if(axiosError.status===409){

        toast.error("Review Requested already")
      }else if(axiosError.status===429){
        toast.error("Too many review requests")
      }
    }
  }
  return (
    <div className="ml-36 flex items-start justify-start">
              
          
          
        
      <div className="w-1/4 h-screen flex flex-col mt-10">
      <h1 className="text-3xl text-gray-800 font-bold mb-6">Lessons</h1>

        {resources.map((resource) => (
          <div
            key={resource._id}
            onClick={() => resourceHandler(resource)}
            className={`${
              active === resource.chapterName
                ? 'bg-blue-600 text-white'
                : 'bg-white'
            } h-20 w-3/4 shadow-lg flex items-center justify-start mt-4 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-blue-100`}
          >
            <h1 className="text-lg ml-4 font-semibold">
              {resource.chapterName}
            </h1>
          </div>
        ))}

        {quizes.map((quiz) => (
          <div
            key={quiz._id}
            onClick={() => quizHandler(quiz)}
            className={`${
              active === quiz.chapterName
                ? 'bg-blue-600 text-white'
                : 'bg-white'
            } h-20 w-3/4 shadow-lg flex items-center justify-start mt-4 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-blue-100`}
          >
            <h1 className="text-lg ml-4 font-semibold">{quiz.chapterName}</h1>
          </div>
        ))}
      </div>

      {/* Active Resource Section */}
      {active && type === 'resource' && (
        <div className="flex flex-col items-start justify-center ml-10">
          <h1 className="text-3xl text-gray-800 mt-20 font-bold">
            {activeresource?.chapterName}
          </h1>
          {activeresource?.Section.map((resource) => (
            <Fragment key={resource._id}>
              <div className="mt-20 text-3xl font-semibold text-gray-700">
                <u>{resource.sectionName}</u>
              </div>
              {resource.content.map((content) => (
                <Fragment key={content._id}>
                  <div className="text-xl mt-4 font-semibold text-gray-800">
                    {content.subheading}
                  </div>
                  <div className="text-sm mt-2 text-gray-600">
                    {content.article}
                  </div>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {/* Active Quiz Section */}
      {active && type === 'quiz' && (
        <div className="flex flex-col items-start justify-center ml-10">
          <h1 className="text-3xl text-gray-800 mt-20 font-bold">
            {activequiz?.chapterName}
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col items-start justify-center mt-4"
          >
            {activequiz?.Quiz.map((quiz) => (
              <div key={quiz._id} className="w-3/4 text-3xl mt-10">
                <h1 className="text-black text-xl font-semibold">
                  {quiz.question}
                </h1>
                <div className="flex items-center mt-2">
                  <img src="/quiz/reward.png" alt="Reward" className="h-6" />
                  <p className="text-xs font-bold text-green-500 ml-2">
                    {quiz.reward} + pts
                  </p>
                </div>

                {quiz.options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-start mt-2 transition-transform transform hover:scale-105"
                  >
                    <input
                      className="mr-4 h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                      name={quiz.question}
                      type="radio"
                      value={option}
                      id={`option-${option}`}
                    />
                    <label
                      htmlFor={`option-${option}`}
                      className="text-lg text-gray-800 hover:text-blue-600 transition duration-200"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              className="mt-4 bg-blue-600 text-white text-xs font-semibold border rounded-lg p-2 transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              Check
            </button>
          </form>
        </div>
      )}
      <button onClick={()=>reviewRequestHandler()} className='text-xs w-20 text-nowrap border mr-10 mt-10 border-white border-b-black '>Request Review</button>



      <ToastContainer
        style={{
          backgroundColor: 'gray',
          color: 'white',
          borderRadius: '10px',
        }}
      />
      {
        result && (
          <QuizCheck finalReward={finalReward} verifydialogRef={resultdialogRef} closeHandler={resultCloseHandler} responseData={responseData}/>
        )
      }
      {
        result && <ConfettiExplosion/> 
      }
    </div>
  );
}
