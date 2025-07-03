import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import TextScroller from "./film/TextScroller";

const Film: React.FC<{
  img: string;
  title: string;
  director: string;
  release: string;
  trailerYoutubeId: string;
  rating: number;
  tmdb: string;
}> = ({ img, title, director, release, trailerYoutubeId, rating, tmdb }) => {
  const [reveal, setReveal] = useState<boolean>(false);
  return (
    <div className="flex-1 bg-white">
      <div className="relative aspect-6/9 mx-auto">
        <Image
          fill
          objectFit="cover"
          alt={`${title}_img_cover`}
          src={img}
          onLoadingComplete={() => setReveal(true)}
        />

        <div
          className={`flex w-full h-full bg-black text-white ${
            reveal ? "hidden" : "display"
          }`}
        >
          <svg
            className="m-auto h-4 w-4 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>

      <TextScroller
        className="font-bold uppercase tracking-tight text-xs"
        text={`${title}`}
        uid={`${title}`}
      />

      <div className="flex flex-row justify-between text-xs">
        <p>{rating ? `${rating}` : `-`}</p>

        {release && <p>{`${dayjs(release).year()}`}</p>}
      </div>

      <TextScroller
        className="uppercase tracking-tight text-2xs"
        text={`${director}`}
        uid={`director_${title}`}
      />

      <div className="flex flex-row justify-between text-2xs">
        {tmdb ? (
          <a
            href={`https://letterboxd.com/tmdb/${tmdb}`}
            target="_blank"
            className="underline"
          >
            LETTERBOXD
          </a>
        ) : (
          <span>-</span>
        )}

        {trailerYoutubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${trailerYoutubeId}`}
            target="_blank"
            className="underline"
          >
            YOUTUBE
          </a>
        )}
      </div>
    </div>
  );
};

export default Film;
