import { ReactElement, Ref, useEffect, useState } from 'react';
import axiosInstance from '../../helper/axiosInstance';
import { ProgressProps } from '../../types/progressProps';
import url from '../../helper/backendUrl';

export default function ProgressDialog({
  dialogRef,
  closeHandler,
  courseId,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  courseId: string;
}): ReactElement {
  const [progress, setProgress] = useState<ProgressProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function progressFetcher() {
      try {
        const response = (await axiosInstance.get(`/user/progress/${courseId}`))
          .data;
        if (response.message === 'success') {
          setProgress(response.progress);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    progressFetcher();
  }, [courseId]);

  return (
    <dialog
      ref={dialogRef}
      className="flex flex-col items-center justify-start p-6 rounded-lg shadow-2xl bg-white relative"
      style={{
        height: '80vh',
        width: '60vw',
        border: 'none',
        overflowY: 'auto',
      }}
    >
      <button
        onClick={closeHandler}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition duration-200"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-pulse h-24 w-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          {/* Course Information */}
          {progress && Object.keys(progress).length !== 0 ? (
            <>
              <div className="flex items-center gap-4 mb-6 w-full bg-gray-100 p-4 rounded-lg shadow-md">
                <img
                  src={`${url}/course/${progress.courseId?.courseImage}`}
                  alt="Course Image"
                  className="h-24 w-24 object-cover rounded-lg shadow-lg"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-bold text-gray-800">
                    {progress.courseId?.courseName}
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">
                    {progress.courseId?.courseDescription}
                  </p>
                </div>
              </div>
              <h1 className="text-xl font-bold mb-4">Quiz History</h1>
            </>
          ) : null}

          {/* Progress List */}
          <div className="w-full">
            {progress?.progress?.length ? (
              progress.progress.map((roadmapProgress, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white shadow-lg p-4 rounded-lg mb-4 border border-gray-200"
                >
                  <img
                    src={`${url}/roadmap/${roadmapProgress?.roadmapId?.roadmapImage}`}
                    alt="Roadmap Image"
                    className="h-16 w-16 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex flex-col w-full">
                    <h2 className="text-lg font-medium text-gray-700">
                      {roadmapProgress?.roadmapId?.roadmapName}
                    </h2>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {roadmapProgress.quizes.map((quiz, quizIndex) => (
                        <div key={quizIndex}>
                          <p>
                            Chapter Name:{' '}
                            <span className="font-bold">
                              {quiz.quizId.chapterName}
                            </span>
                          </p>
                          <p className="font-light text-xs text-gray-500">
                            {quiz.date.toString()}
                          </p>
                          <div
                            key={quizIndex}
                            className="bg-green-100 text-green-600 w-10 rounded-full px-3 py-1 text-sm font-semibold shadow-sm"
                          >
                            {quiz.reward}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-6">
                <p>No progress history available.</p>
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
