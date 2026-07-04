const Footer = () => {
  return (
    <div className="tracking-widest w-11/12 flex flex-row justify-between text-left uppercase mx-4 sm:mx-auto mt-6 mb-4">
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
          <span className="font-mono mr-1">©</span>
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
