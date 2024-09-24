import { Dispatch, memo, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { chapterProps, courseProps, roadmapProps } from '../types/courseProps';
import axiosInstance from '../helper/axiosInstance';

type Inputs = {
  search: string;
};

//a generic component for all search functionalities
function TopBar({
  search,
  setSearch,
  setCourses,
  currentpage,
  setRoadmaps,
  setChapters,
  courseId,
  roadmapId

}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  //iam using this component as a generic
  setCourses?: Dispatch<SetStateAction<Array<courseProps>>>;
  setRoadmaps?: Dispatch<SetStateAction<Array<roadmapProps>>>;
  setChapters?:Dispatch<SetStateAction<Array<chapterProps>>>;
  roadmapId?:string;
  currentpage: number;
  courseId?:string
}): ReactElement {
  const SpecialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~1-9]/;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    if (active) {
      async function dataWrapper() {
        if(setCourses){
          const response = (
            await axiosInstance.get(
              `/user/course?page=${currentpage}&search=${search}`)
          ).data;
          setCourses(response.courses);
        }else if(setRoadmaps){
          const response = (
            await axiosInstance.get(
                    `/user/roadmap/${courseId}?page=${currentpage}&search=${search}`)
        ).data;
        console.log(response)
        setRoadmaps(response.roadmaps);
        }else if(setChapters){
          const response = (
            await axiosInstance.get(
                `/admin/chapter/${roadmapId}?page=${currentpage}&search=${search}`)
          ).data;
        console.log(response)
        setChapters(response.chapters);
        }
      }
      dataWrapper();
    }
  }, [search, active, courseId, currentpage, setCourses, setRoadmaps, setChapters, roadmapId]);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    setActive(true);
    setSearch(data.search);
  };
  const notificationHandler = () => {
    alert('notification clicked');
  };
  const settingHandler = () => {
    alert('setting clicked');
  };
  if (active && watch('search') === '') {
    window.location.reload();
  }

  return (
    <div className="ml-36 flex justify-center flex-col items-end mt-4">
      <form
        className="flex  items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-center border border-gray-400 rounded-lg">
        <input
            id="chapterName"
            className="h-10 px-4 placeholder:text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter search term"
            {...register('search', {
              required: {
                value: true,
                message: 'Please enter a search term',
              },
              minLength: {
                value: 5,
                message: 'Please enter at least 5 characters',
              },
              validate: (tag: string) => {
                if (tag.trim() === '') return 'Please enter a search term';
                if (SpecialCharRegex.test(tag)) return 'Please enter valid characters';
                return true;
              },
            })}
          />
          <button className="flex items-center justify-center" type="submit">
            <img src="/search.png" className="h-6 w-6" />
          </button>
        </div>
        {/* notification button */}
        <button
          type="button"
          onClick={notificationHandler}
          className="flex items-center justify-center ml-4"
        >
          <img src="/course/notification.png" className="h-6 w-6" />
        </button>
        {/* settings button */}
        <button
          type="button"
          onClick={settingHandler}
          className="flex items-center justify-center ml-4 mr-4"
        >
          <img src="/course/setting.png" className="h-6 w-6" />
        </button>
      </form>
      {errors.search && (
        <span className="text-xs text-red-500">{errors.search.message}</span>
      )}
    </div>
  );
}
export default memo(TopBar)