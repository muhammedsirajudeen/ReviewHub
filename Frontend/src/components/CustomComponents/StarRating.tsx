import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';

export default function StarRating({
  starCount,
  setStarcount,
  initialCount,
  disabled,
}: {
  starCount: number;
  setStarcount?: Dispatch<SetStateAction<number>>;
  initialCount: number;
  disabled?: boolean;
}): ReactElement {
  // State to track filled stars
  const [filledStars, setFilledStars] = useState<number[]>([]);

  useEffect(() => {
    // Initialize filled stars based on initialCount
    const newFilledStars = Array.from({ length: starCount }, (_, i) => (i < initialCount ? 1 : 0));
    setFilledStars(newFilledStars);
  }, [initialCount, starCount]);

  const starHandler = (c: number) => {
    // Update filled stars
    const newFilledStars = filledStars.map((_, index) => (index < c ? 1 : 0));
    setFilledStars(newFilledStars);

    // Update the external state if provided
    if (setStarcount) {
      setStarcount(c);
    }
  };

  return (
    <div className="w-auto flex items-center justify-center">
      {filledStars.map((filled, index) => {
        return (
          <button
            disabled={disabled}
            type="button"
            key={index}
            onClick={() => starHandler(index + 1)}
            aria-roledescription="set star"
            aria-label="button"
          >
            <img
              id={`count-${index + 1}`}
              className="h-10 w-10 m-3"
              src={filled ? '/feedback/starfilled.png' : '/feedback/star.png'}
              alt={`Star ${index + 1}`}
            />
          </button>
        );
      })}
    </div>
  );
}
