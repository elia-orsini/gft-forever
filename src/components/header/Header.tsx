import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { pathname } = useRouter();
  const isIndex = pathname === "/";

  return (
    <div className="flex flex-col lg:flex-row w-full lg:px-10 md:px-0 md:mx-auto md:justify-between md:items-center my-4 gap-2">
      <div className="flex items-center justify-between lg:justify-start gap-6">
        {isIndex ? (
          <p className="tracking-widest font-bold font-mono">
            GFT FOREVER !!!!
          </p>
        ) : (
          <Link href="/" className="tracking-widest font-bold font-mono">
            GFT FOREVER !!!!
          </Link>
        )}

        {pathname !== "/all" && (
          <Link
            href="/all"
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
