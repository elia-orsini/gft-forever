import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row w-full md:w-11/12 mx-4 md:mx-auto md:justify-between my-4">
      <p className="font-[MunicipalGrotesque] tracking-widest">GFT FOREVER !!!!</p>
      <p className="font-[MunicipalGrotesque] tracking-widest text-xs sm:my-auto">
        an archive of all the films shown at gft in the past year or so.
      </p>
    </div>
  );
};

export default Header;
