import { ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import {
  quizProps,
  QuizProps,
  resourceProps,
  sectionProps,
} from '../../types/courseProps';
import ResourceForm from '../../components/Form/Resource/ResourceForm';
import { flushSync } from 'react-dom';
import QuizForm from '../../components/Form/Resource/QuizForm';
import { ToastContainer } from 'react-toastify';
import ResourceDelete from '../../components/Form/Resource/ResourceDelete';
import QuizDelete from '../../components/Form/Resource/QuizDelete';
import axiosInstance from '../../helper/axiosInstance';

export default function Resource(): ReactElement {
  const [resource, setResource] = useState<resourceProps>();
  const { chapterId, quizStatus } = useLocation().state;
  const [active, setActive] = useState<string>('');
  const [activeresource, setActiveresource] = useState<sectionProps>();
  const [quiz, setQuiz] = useState<QuizProps>();
  const [activequiz, setActivequiz] = useState<quizProps>();
  const [resourceEdit, setResourceEdit] = useState<boolean>(false);
  const [resourceDelete, setResourceDelete] = useState<boolean>(false);

  const [quizedit, setQuizedit] = useState<boolean>(false);
  const [quizdelete, setQuizdelete] = useState<boolean>(false);
  const [method, setMethod] = useState<string>('');
  //refactor this
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const quizdialogRef = useRef<HTMLDialogElement>(null);
  const deleteQuizDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    async function dataWrapper() {
      if (!quizStatus) {
        const response = (
          await axiosInstance.get(`/admin/resource/${chapterId}`)
        ).data;
        //   console.log(response.resource)
        if (response.resource) {
          setResource(response.resource);
          setActive(response.resource?.Section[0].sectionName);
          setActiveresource(response.resource?.Section[0]);
        } else {
          setResource(undefined);
        }
      } else {
        //it is quiz
        const response = (await axiosInstance.get(`/admin/quiz/${chapterId}`))
          .data;
        if (response.quiz) {
          setQuiz(response.quiz);
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
  const editHandler = () => {
    setMethod('put');

    flushSync(() => {
      setResourceEdit(true);
    });
    dialogRef.current?.showModal();
  };
  const closeEditHandler = () => {
    dialogRef.current?.close();
    setResourceEdit(false);
    //reload when we clear the active resource
    if (!activeresource) window.location.reload();
  };
  const quizEditHandler = (quiz: quizProps) => {
    setMethod('put');
    setActivequiz(quiz);
    flushSync(() => {
      setQuizedit(true);
    });
    quizdialogRef.current?.showModal();
  };
  const closeQuizEditHandler = () => {
    quizdialogRef.current?.close();
    setQuizedit(false);
    // if(!activequiz) window.location.reload()
  };
  //handling adding here
  const addResourceHandler = () => {
    flushSync(() => {
      setMethod('post');
      setActiveresource(undefined);
      setResourceEdit(true);
    });
    dialogRef.current?.showModal();
  };

  const deleteResourceHandler = async (section: sectionProps) => {
    console.log(section);
    flushSync(() => {
      setResourceDelete(true);
      setActiveresource(section);
    });
    deleteDialogRef.current?.showModal();
    //we have access to the curent resource id as well as the section id here
  };
  const closeDeleteResourceHandler = () => {
    deleteDialogRef.current?.close();
    setResourceDelete(false);
  };

  //rest of the operations on the quiz module
  const addQuizHandler = () => {
    flushSync(() => {
      setMethod('post');
      setActivequiz(undefined);
      setQuizedit(true);
    });
    quizdialogRef.current?.showModal();
  };
  const deleteQuizHandler = async (quiz: quizProps) => {
    flushSync(() => {
      setQuizdelete(true);
      setActivequiz(quiz);
    });
    deleteQuizDialogRef.current?.showModal();
    // setQuizdelete(false)
    // deleteQuizDialogRef.current?.close()
    //we can access the main id here
  };
  const closeDeleteQuizHandler = () => {
    setQuizdelete(false);
    deleteQuizDialogRef.current?.close();
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row ml-36 mt-10">
        {!quizStatus ? (
          <>
            <div
              id="lesson-container"
              className="h-screen w-1/4 flex-col bg-gray-100 p-4 rounded-lg shadow-lg"
            >
              <h1 className="text-lg text-gray-600 font-semibold mb-4">
                Lessons
              </h1>
              <div className="w-full h-10 flex items-center justify-center bg-blue-400 text-white rounded-lg mb-4">
                {resource?.chapterName}
              </div>
              <div className="overflow-y-auto h-3/4">
                {resource?.Section.map((section) => (
                  <div
                    key={section.sectionName}
                    onClick={() => activeHandler(section)}
                    className={`cursor-pointer w-full p-3 flex items-start justify-between rounded-lg mb-2 transition-all duration-200 
                  ${
                    active === section.sectionName
                      ? 'bg-blue-500 text-white font-bold'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                  >
                    <span>{section.sectionName}</span>
                    <button
                      onClick={() => deleteResourceHandler(section)}
                      className="bg-red-400 p-1 rounded-full"
                    >
                      <img className="h-3 w-3" src="/delete.png" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addResourceHandler}
                className="w-full h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-bold mt-4"
              >
                <p className="text-sm">Add Chapter +</p>
              </button>
            </div>
            <div className="w-full flex flex-col items-center h-screen justify-start mt-10 lg:mt-0 lg:ml-10">
              <h1 className="text-3xl text-gray-600 font-semibold mb-4">
                {activeresource?.sectionName}
              </h1>
              {activeresource?.content.map((content) => (
                <div
                  key={content.subheading}
                  onClick={editHandler}
                  className="flex w-full flex-col items-start justify-start mt-10 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h1 className="text-xl font-bold">{content.subheading}</h1>
                  <p className="text-lg text-gray-500">{content.article}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-col w-full mt-10">
            <h1 className="text-3xl text-gray-600 font-semibold mb-4">
              {quiz?.chapterName}
            </h1>
            <button
              onClick={addQuizHandler}
              className="bg-blue-600 text-white h-10 w-10 flex items-center justify-center rounded-full shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add Quiz"
            >
              +
            </button>
            {quiz?.Quiz.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => quizEditHandler(quiz)}
                className="w-3/4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4"
              >
                <h1 className="text-black text-xl font-semibold">
                  {quiz.question}
                </h1>
                <p className="text-xs">
                  {quiz.multiselect && 'It is a multiselect question'}
                </p>
                <div className="flex items-center">
                  <img src="/quiz/reward.png" alt="Reward" className="mr-2" />
                  <p className="text-xs font-bold text-green-500">
                    {quiz.reward} + pts
                  </p>
                </div>
                <form className="flex flex-col items-start mt-4">
                  {quiz.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        className="mr-4"
                        name={quiz.question}
                        type="radio"
                        value={option}
                      />
                      <p className="text-lg text-gray-500">{option}</p>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuizHandler(quiz);
                    }}
                    className="flex items-center text-xs mt-2 justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow transition duration-200"
                  >
                    <img src="/delete.png" alt="Delete" className="w-3 h-3" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
      {resourceEdit && (
        <ResourceForm
          method={method}
          //passing resource Id
          resourceId={resource?._id ?? ''}
          section={activeresource}
          closeHandler={closeEditHandler}
          dialogRef={dialogRef}
        />
      )}
      {resourceDelete && (
        <ResourceDelete
          resourceId={resource?._id}
          section={activeresource}
          closeHandler={closeDeleteResourceHandler}
          deleteDialogRef={deleteDialogRef}
        />
      )}
      {quizedit && (
        <QuizForm
          method={method}
          quizId={quiz?._id ?? ''}
          quiz={activequiz}
          closeHandler={closeQuizEditHandler}
          dialogRef={quizdialogRef}
        />
      )}
      {quizdelete && (
        <QuizDelete
          quizId={quiz?._id}
          quiz={activequiz}
          deleteQuizDialogRef={deleteQuizDialogRef}
          closeHandler={closeDeleteQuizHandler}
        />
      )}
      <ToastContainer />
    </>
  );
}
