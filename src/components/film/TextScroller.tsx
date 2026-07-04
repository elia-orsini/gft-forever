import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
// @ts-ignore
import { useGSAP } from "@gsap/react";

const TextScroller: React.FC<{
  className: string;
  text: string;
  uid: string;
  href?: string | null;
}> = ({ className, text, uid, href }) => {
  const renderText = (key: string) => {
    if (!text) return null;

    if (href) {
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} w-max whitespace-nowrap underline`}
        >
          {text}
        </a>
      );
    }

    return (
      <p key={key} className={`${className} w-max whitespace-nowrap`}>
        {text}
      </p>
    );
  };
  const [toScroll, setToScroll] = useState(false);

  const first = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let translation = 0;
    const animationSpeed = 0.05;

    const gsapAnimation = () => {
      if (translation < -49.99) {
        translation = 0;
      }
      gsap.set(first.current, { x: `${translation}%` });
      translation -= animationSpeed;
    };

    if (toScroll && first.current) {
      gsap.ticker.add(gsapAnimation);
    }
  }, [toScroll]);

  useEffect(() => {
    const element = document.getElementById(`scrollingContainer-${uid}`);

    const innerElement = document.getElementById(
      `roastersInnerContainer-${uid}`
    );

    if (
      element &&
      innerElement &&
      innerElement.scrollWidth > element.clientWidth
    ) {
      setToScroll(true);
    }
  }, [text, uid]);

  return (
    <div
      id={`scrollingContainer-${uid}`}
      className="flex overflow-hidden w-full select-none"
    >
      <div
        ref={first}
        id={`roastersInnerContainer-${uid}`}
        className="flex py-1 gap-x-1 w-max"
      >
        {renderText(`roaster_A_${uid}`)}

        {text && toScroll && renderText(`roaster_B_${uid}`)}
      </div>
    </div>
  );
};

export default TextScroller;
