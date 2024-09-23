import { ReactElement } from 'react';

type pageHandlerType = (pagecount: number) => Array<number>;

export default function PaginationComponent({
  previouspageHandler,
  nextpageHandler,
  currentpage,
  pageHandler,
  pagecount,
}: {
  previouspageHandler: VoidFunction;
  nextpageHandler: VoidFunction;
  currentpage: number;
  pageHandler: pageHandlerType;
  pagecount: number;
}): ReactElement {
  return (
    <div className="flex items-center justify-center w-full fixed bottom-10 left-1/2 transform -translate-x-1/2">
      <button
        onClick={previouspageHandler}
        className="flex h-8 items-center justify-center p-2 transition-colors duration-200 hover:bg-gray-200 rounded-lg shadow-md"
      >
        <img src="/course/prev.png" className="h-6" alt="Previous" />
      </button>

      <div className="flex space-x-1">
        {pageHandler(pagecount).map((page) => {
          return (
            <button
              key={page}
              className={`border border-gray-300 p-2 rounded-xl h-8 flex items-center justify-center text-xs transition-colors duration-200 ${
                currentpage === page
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={nextpageHandler}
        className="flex h-8 items-center justify-center p-2 transition-colors duration-200 hover:bg-gray-200 rounded-lg shadow-md"
      >
        <img src="/course/next.png" className="h-6" alt="Next" />
      </button>
    </div>
  );
}
