import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { pathname } = useRouter();
  const isIndex = pathname === "/";

  return (
    <div className="flex flex-col md:flex-row w-full md:w-11/12 mx-4 md:mx-auto md:justify-between md:items-center my-4 gap-2">
      <div className="flex items-center gap-4">
        {isIndex ? (
          <p className="tracking-widest font-bold font-mono">GFT FOREVER !!!!</p>
        ) : (
          <Link href="/" className="tracking-widest font-bold font-mono">
            GFT FOREVER !!!!
          </Link>
        )}
        {pathname !== "/films" && (
          <Link
            href="/films"
            className="text-xs uppercase tracking-widest underline"
          >
            view all
          </Link>
        )}
      </div>
      <p className="tracking-widest text-xs sm:my-auto">
        an archive of all the films shown at gft in the past year or so.
      </p>
    </div>
  );
};

export default Header;
