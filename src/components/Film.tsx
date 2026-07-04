import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import TextScroller from "./film/TextScroller";
import Spinner from "./Spinner";

const Film: React.FC<{
  img: string;
  title: string;
  director: string;
  release: string;
  trailerYoutubeId: string;
  rating: number;
  tmdb: string;
  letterboxdUrl?: string | null;
}> = ({
  img,
  title,
  director,
  release,
  trailerYoutubeId,
  rating,
  tmdb,
  letterboxdUrl,
}) => {
  const [reveal, setReveal] = useState<boolean>(false);
  const letterboxdHref =
    letterboxdUrl || (tmdb ? `https://letterboxd.com/tmdb/${tmdb}` : null);

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
          className={`flex w-full h-full border border-black text-white ${
            reveal ? "hidden" : "display"
          }`}
        >
          <Spinner className="m-auto h-5 w-5 animate-spin text-black" />
        </div>
      </div>

      <TextScroller
        className="font-bold uppercase tracking-tight text-xs"
        text={`${title}`}
        uid={`${title}`}
        href={letterboxdHref}
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

      {trailerYoutubeId && (
        <div className="flex flex-row justify-end text-2xs">
          <a
            href={`https://www.youtube.com/watch?v=${trailerYoutubeId}`}
            target="_blank"
            className="underline"
          >
            YOUTUBE
          </a>
        </div>
      )}
    </div>
  );
};

export default Film;
