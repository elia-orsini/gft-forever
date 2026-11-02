import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = () => {
  const { pathname } = useRouter();
  const isIndex = pathname === "/";
  const [filmCount, setFilmCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/stats", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch stats");
        return response.json();
      })
      .then((data: { totalFilms: number }) => setFilmCount(data.totalFilms))
      .catch((error) => {
        if (error.name !== "AbortError") setFilmCount(null);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full md:justify-between md:items-center my-4 gap-2">
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
        an archive of all the{filmCount !== null ? ` ${filmCount}` : ""} films
        shown at gft
      </p>
    </div>
  );
};

export default Header;
