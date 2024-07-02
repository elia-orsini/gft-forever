import RotatingSVG from "./RotatingSVG";

const Footer = () => {
  return (
    <div className="w-11/12 flex flex-row justify-between text-left uppercase mx-auto pt-20 pb-10">
      <div className="text-2xs my-auto">
        <p>
          made with {`<3`} by{" "}
          <a
            href="https://elia-orsini.com"
            rel="noreferrer"
            target="_blank"
            className="underline"
          >
            elia
          </a>{" "}
          © 2024
        </p>

        <p className="mt-2">frontend crafted using next.js.</p>
      </div>

      <RotatingSVG />
    </div>
  );
};

export default Footer;
