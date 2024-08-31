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
    <div className="flex-1 bg-white">
      <div className="relative aspect-6/9 mx-auto cursor-pointer">
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

      <p className="font-bold text-left text-xs uppercase mt-2 tracking-tight overflow-scroll">
        {title.length > 30 ? `${title.slice(0, 30)}...` : `${title}`}
      </p>

      {release && <p className="text-2xs">{`${dayjs(release).year()}`}</p>}

      <p className="w-full text-left text-2xs uppercase tracking-tight">
        {director && `directed by ${director}`}
      </p>
    </div>
  );
};

export default Film;
