import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full sm:px-10 sm:justify-between pb-10 sm:pb-0">
      <div className="flex relative w-64 h-10">
        <Image alt="gft-logo" src="/logo.png" fill objectFit="contain" />
      </div>
      <p className="mx-3 sm:ml-20 px-2 text-xs sm:my-auto">
        an archive of all the films shown at gft in the past year or so.
      </p>
    </div>
  );
};

export default Header;
