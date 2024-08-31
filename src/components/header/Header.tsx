import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full sm:w-11/12 mx-4 sm:mx-auto sm:justify-between my-4 font-mono">
      <p>GFT FOREVER !!!!</p>
      <p className="text-xs sm:my-auto">
        an archive of all the films shown at gft in the past year or so.
      </p>
    </div>
  );
};

export default Header;
