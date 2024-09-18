import {  ReactElement, Ref, useState } from 'react';
import {  useForm } from 'react-hook-form';
import { quizProps } from '../../types/courseProps';
import classNames from 'classnames';

export default function QuizForm({
  dialogRef,
  closeHandler,
  quiz,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  closeHandler: VoidFunction;
  quiz: quizProps | undefined;
}): ReactElement {
    const [options,setOptions]=useState<Array<string>>(quiz?.options ?? [])

    const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<quizProps>({
    defaultValues: {
      question: quiz?.question,
      answer: quiz?.answer,
      reward: quiz?.reward,
      options: options,
    },
  });
  const onSubmit = (data: quizProps) => {
    console.log(data);
  };
  const addHandler=()=>{
    setOptions([...options,"one"])
  }
  const deleteHandler=(optionName:string)=>{
    console.log(optionName)
    const modified=options.filter((option)=>option!==optionName)
    console.log(modified)
    setOptions(modified)
    setValue('options',modified)
  }

  return (
    <dialog
    style={{height:"60vh",width:"40vw"}}
      className="h-96 w-96 flex flex-col p-6 rounded-lg shadow-lg bg-white"
      ref={dialogRef}
    >
      <button
        onClick={closeHandler}
        className="self-end text-black p-2 hover:bg-gray-200 rounded-full transition"
      >
        x
      </button>
      <h2 className="text-xl font-semibold text-center mb-4">Quiz Form</h2>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <input
            id="question"
            placeholder="Enter the question"
            className={classNames(
              'h-10 border rounded-lg w-full px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
              { 'border-red-500': errors.question }
            )}
            {...register('question', {
              required: { value: true, message: 'Please enter the question' },
              minLength: {
                value: 5,
                message: 'At least 5 characters required',
              },
            })}
          />
          {errors.question && (
            <p className="text-red-500 text-xs">{errors.question.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            Answer
          </label>
          <input
            id="answer"
            placeholder="Enter the answer"
            className={classNames(
              'h-10 border rounded-lg w-full px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
              { 'border-red-500': errors.answer }
            )}
            {...register('answer', {
              required: { value: true, message: 'Please enter the answer' },
              minLength: {
                value: 5,
                message: 'At least 5 characters required',
              },
            })}
          />
          {errors.answer && (
            <p className="text-red-500 text-xs">{errors.answer.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="reward"
            className="block text-sm font-medium text-gray-700"
          >
            Reward
          </label>
          <input
            id="reward"
            type="number"
            placeholder="Enter the reward"
            className={classNames(
              'h-10 border rounded-lg w-full px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
              { 'border-red-500': errors.reward }
            )}
            {...register('reward', {
              required: { value: true, message: 'Please enter the reward' },
            })}
          />
          {errors.reward && (
            <p className="text-red-500 text-xs">{errors.reward.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="options"
            className="block text-sm font-medium text-gray-700"
          >
            Options
          </label>
          {options.map((option, index) => (
            <div key={option} className="flex items-center space-x-2">
              <textarea
                id={option}
                placeholder="Enter an option"
                className={classNames(
                  'h-20 border rounded-lg w-full px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4',
                  { 'border-red-500': errors.options?.[index] }
                )}
                {...register(`options.${index}`, {
                  required: { value: true, message: 'Please enter an option' },
                  minLength: {
                    value: 5,
                    message: 'At least 5 characters required',
                  },
                })}
              />
              <button onClick={()=>deleteHandler(option)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                <img className="h-4 w-4" src="/delete.png" alt="Delete" />
              </button>
              {errors.options?.[index] && (
                <p className="text-red-500 text-xs">
                  {errors.options[index].message}
                </p>
              )}
            </div>
          ))}
          <button onClick={addHandler} type='button' className="bg-blue-500 text-white p-2 rounded-full mt-2 hover:bg-blue-600 transition">
            +
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-lg mt-4 hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>
    </dialog>
  );
}
