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
          <p className="m-auto">...</p>
        </div>
      </div>

      <TextScroller
        className="font-bold uppercase tracking-tight text-xs"
        text={`${title}`}
        uid={`${title}`}
      />

      <div className="flex flex-row justify-between">
        <p className="text-2xs">{rating ? `${rating}` : `-`}</p>

        {release && <p className="text-2xs">{`${dayjs(release).year()}`}</p>}
      </div>

      <TextScroller
        className="uppercase tracking-tight text-xs"
        text={`directed by ${director}`}
        uid={`director_${title}`}
      />

      <div className="flex flex-row justify-between text-2xs">
        {tmdb ? (
          <a
            href={`https://www.youtube.com/watch?v=${trailerYoutubeId}`}
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
