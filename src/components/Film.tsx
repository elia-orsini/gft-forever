import Image from "next/image";

const Film: React.FC<{
  link: string;
  img: string;
  title: string;
  rating?: string;
}> = ({ link, img, title, rating }) => {
  return (
    <div className="flex-1 border border-black bg-white m-auto">
      <div className="relative w-full h-[430px] mx-auto border border-black bg-black cursor-pointer">
        <Image fill objectFit="contain" alt={`${title}_img_cover`} src={img} />
      </div>

      <p className="w-72 h-10 font-black text-center text-sm uppercase mt-2 tracking-tight">
        {title}
      </p>
    </div>
  );
};

export default Film;
