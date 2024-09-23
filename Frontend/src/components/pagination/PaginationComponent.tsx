import { ReactElement } from "react";

type pageHandlerType=(pagecount:number)=>Array<number>

export default function PaginationComponent(
    {
        previouspageHandler,
        nextpageHandler,
        currentpage,
        pageHandler,
        pagecount
    }
    :
    {
        previouspageHandler:VoidFunction,
        nextpageHandler:VoidFunction,
        currentpage:number,
        pageHandler:pageHandlerType,
        pagecount:number
    }
):ReactElement{
    return(
        <div className="flex items-center justify-evenly w-32 fixed bottom-10 left-1/2">
        <button
          onClick={previouspageHandler}
          className="flex h-8 items-center justify-center"
        >
          <img src="/course/prev.png" className="h-6" />
        </button>
        {pageHandler(pagecount).map((page) => {
          return (
            <button
              key={page}
              className={`border border-black p-2 rounded-xl h-8 flex items-center justify-center text-xs ${
                currentpage === page ? 'bg-black text-white' : ''
              } `}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={nextpageHandler}
          className="flex h-8 items-center justify-center"
        >
          <img src="/course/next.png" className="h-6" />
        </button>
      </div>
    )
}