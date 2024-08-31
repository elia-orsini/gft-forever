import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
// @ts-ignore
import { useGSAP } from "@gsap/react";

const TextScroller: React.FC<{
  className: string;
  text: string;
  uid: string;
}> = ({ className, text, uid }) => {
  const [toScroll, setToScroll] = useState(false);

  const first = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let translation = 0;
    const animationSpeed = 0.03;

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
        {text && (
          <p
            key={`roaster_A_${uid}`}
            className={`${className} w-max whitespace-nowrap`}
          >
            {text}
          </p>
        )}

        {text && toScroll && (
          <p
            key={`roaster_B_${uid}`}
            className={`${className} w-max whitespace-nowrap`}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextScroller;
