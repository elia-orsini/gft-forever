const Footer = () => {
  return (
    <div className="tracking-widest w-full px-4 mx-auto mt-6 mb-4 text-left uppercase">
      <div className="lg:mx-10 text-2xs">
        <p>
          made by{" "}
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
