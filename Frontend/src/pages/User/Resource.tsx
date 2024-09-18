import axios from 'axios';
import { FormEvent, Fragment, ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import url from '../../helper/backendUrl';
import { QuizProps, resourceProps } from '../../types/courseProps';
import { toast, ToastContainer } from 'react-toastify';

export default function Resource(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Array<resourceProps>>([]);
  const [activeresource, setactiveResource] = useState<resourceProps>();
  const [activequiz, setActivequiz] = useState<QuizProps>();
  const [quizes, setQuizes] = useState<Array<QuizProps>>([]);
  const [active, setActive] = useState<string>('');
  const [type, setType] = useState<string>('');
  useEffect(() => {
    if (!location.state) {
      navigate('/user/courses');
      return;
    }
    async function dataWrapper() {
      const response = (
        await axios.get(`${url}/user/resource/${location.state.roadmapId}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
        })
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
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('hey');
  };
  return (
    <div className="ml-36 flex items-start justify-start">
      <div className="w-1/4 h-screen flex flex-col mt-10">
        <h1 className="text-3xl text-gray-400 font-bold ">Lessons</h1>
        {resources.map((resource) => {
          return (
            <div
              key={resource._id}
              onClick={() => resourceHandler(resource)}
              className={`${
                active === resource.chapterName && 'bg-blue-500 text-white'
              } h-20 w-3/4 shadow-xl flex items-center justify-start mt-4`}
            >
              <h1 className="text-lg ml-2 font-bold">{resource.chapterName}</h1>
            </div>
          );
        })}
        {quizes.map((quiz) => {
          return (
            <div
              key={quiz._id}
              onClick={() => quizHandler(quiz)}
              className={`${
                active === quiz.chapterName && 'bg-blue-500 text-white'
              } h-20 w-3/4 shadow-xl flex items-center justify-start mt-4`}
            >
              <h1 className="text-lg ml-2 font-bold">{quiz.chapterName}</h1>
            </div>
          );
        })}
      </div>
      {active && type === 'resource' && (
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl text-gray-500 mt-20">
            {activeresource?.chapterName}
          </h1>
          {activeresource?.Section.map((resource) => {
            return (
              <Fragment key={resource._id}>
                <div className="mt-20 text-3xl">
                  <u>{resource.sectionName}</u>
                </div>
                {resource.content.map((content) => {
                  return (
                    <Fragment key={content._id}>
                      <div className="text-xl mt-4 ">{content.subheading}</div>
                      <div className="text-sm mt-4">{content.article}</div>
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      )}
      {active && type === 'quiz' && (
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-3xl text-gray-400 mt-20">
            {activequiz?.chapterName}
          </h1>
          {activequiz?.Quiz.map((quiz) => {
            return (
              <div
                key={quiz._id}
                className="w-3/4 text-3xl h-auto flex-col mt-10"
              >
                <h1 className="text-black text-xl">{quiz.question}</h1>
                <div className="flex items-center justify-start">
                  <img src="/quiz/reward.png" />
                  <p className="text-xs align-middle font-bold text-green-500">
                    {quiz.reward} + pts{' '}
                  </p>
                </div>
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex flex-col items-start justify-center"
                >
                  {quiz.options.map((option) => {
                    return (
                      <div
                        key={option}
                        className="flex items-center justify-start mt-2"
                      >
                        <input
                          className="mr-4"
                          name={quiz.question}
                          type="radio"
                          key={option}
                          value={option}
                        />
                        <p className="text-lg text-gray-500">{option}</p>
                      </div>
                    );
                  })}
                  <button
                    className="text-xs bg-blue-600 text-white  border  rounded-lg p-2 mt-10 "
                    type="submit"
                  >
                    check
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
