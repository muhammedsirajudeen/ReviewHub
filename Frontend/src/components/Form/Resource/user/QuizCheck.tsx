import { ReactElement, Ref } from 'react';
import { responseProps } from '../../../../types/courseProps';
import { v4 } from 'uuid';

export default function QuizCheck({
  verifydialogRef,
  closeHandler,
  responseData,
  finalReward,
}: {
  verifydialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  responseData: responseProps[];
  finalReward: number;
}): ReactElement {
  return (
    <dialog
      style={{ height: '60vh', width: '60vw' }}
      className="flex flex-col bg-white shadow-lg rounded-lg p-6"
      ref={verifydialogRef}
    >
      <button
        className="self-end border border-gray-300 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200"
        onClick={closeHandler}
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold text-center mb-4">Quiz Results</h2>
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-bold">Question</p>
        <p className="text-lg font-bold">Reward</p>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {responseData.map((response) => (
          <div
            key={v4()}
            className="flex items-center justify-between border-b py-2"
          >
            <p
              className={`${
                response.reward === 0 ? 'text-red-500' : 'text-green-500'
              } text-lg`}
            >
              {response.question}
            </p>
            <p
              className={`${
                response.reward === 0 ? 'text-red-500' : 'text-green-500'
              } text-lg`}
            >
              {response.reward}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-48">
        <p className="text-lg font-bold text-center">
          Total Points: <span className="text-blue-600">{finalReward}</span>
        </p>
      </div>
    </dialog>
  );
}
