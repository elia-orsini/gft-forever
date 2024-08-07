import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

const Film: React.FC<{
  img: string;
  title: string;
  director: string;
  release: string;
  trailerYoutubeId: string;
}> = ({ img, title, director, release, trailerYoutubeId }) => {
  const [reveal, setReveal] = useState<boolean>(false);
  return (
    <div className="flex-1 border border-black bg-white">
      <div className="relative aspect-6/9 mx-auto cursor-pointer">
        {trailerYoutubeId ? (
          <a
            href={`https://www.youtube.com/watch?v=${trailerYoutubeId}`}
            target="_blank"
          >
            <Image
              fill
              objectFit="cover"
              alt={`${title}_img_cover`}
              src={img}
              onLoadingComplete={() => setReveal(true)}
            />
          </a>
        ) : (
          <Image
            fill
            objectFit="cover"
            alt={`${title}_img_cover`}
            src={img}
            onLoadingComplete={() => setReveal(true)}
          />
        )}

        <div
          className={`flex w-full h-full bg-black text-white ${
            reveal ? "hidden" : "display"
          }`}
        >
          <p className="m-auto">loading ..</p>
        </div>
      </div>

      <p className="h-10 font-bold text-center text-xs uppercase mt-2 tracking-tight overflow-scroll">
        {title.slice(0, 60)}{" "}
        <span className="font-normal ml-1 text-xs">
          {release && `(${dayjs(release).year()})`}
        </span>
      </p>
      <p className="w-full border-t p-1 border-black text-left text-xs uppercase tracking-tight">
        {director ? `directed by ${director.slice(0, 25)}` : `-----`}
      </p>
    </div>
  );
};

export default Film;
