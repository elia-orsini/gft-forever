import Image from "next/image";

const NoFilmsFound: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center mx-auto mt-10">
      <Image
        src="/skull.jpeg"
        alt="no films found"
        width={437}
        height={470}
        className="w-32 h-auto"
      />
      <p className="mt-4 text-sm">no films found</p>
    </div>
  );
};

export default NoFilmsFound;
