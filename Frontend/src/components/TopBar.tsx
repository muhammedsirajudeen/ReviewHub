import { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  search: string;
};

export default function TopBar(): ReactElement {
    const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;

    const {
      register,
      handleSubmit,
    //   watch,
      formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }
    const notificationHandler=()=>{
        alert("notification clicked")
    }
    const settingHandler=()=>{
        alert("setting clicked")
    }

    


    return (
      <div className="ml-36 flex justify-center flex-col items-end mt-4">
        <form className='flex  items-center justify-center' onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center border border-gray-400 rounded-lg">
            <input
              id="chapterName"
              className="h-8 placeholder:text-xs rounded-lg"
              placeholder="enter the search term"
              {...register('search', {
                required: {
                  value: true,
                  message: 'please enter the search term',
                },
                minLength: {
                  value: 5,
                  message: 'please enter the required characters',
                },
                validate: (tag: string) => {
                  if (tag.trim() === '') return 'please enter the search term';
                  if (SpecialCharRegex.test(tag))
                    return 'please enter valid Character';
                  return true;
                },
              })}
            />
            <button className='flex items-center justify-center' type='submit'>
                <img src="/search.png" className="h-6 w-6" />
            </button>
          </div>
          {/* notification button */}
          <button type='button' onClick={notificationHandler} className='flex items-center justify-center ml-4'>
              <img src="/course/notification.png" className="h-6 w-6" />
          </button>
          {/* settings button */}
          <button type='button' onClick={settingHandler} className='flex items-center justify-center ml-4 mr-4'>
              <img src="/course/setting.png" className="h-6 w-6" />
          </button>


        </form>
        {errors.search && (
            <span className="text-xs text-red-500">
              {errors.search.message}
            </span>
          )}
      </div>
    );
}
