const RotatingSVG: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="5 5 90 90"
      width="80"
      height="80"
      className="m-auto sm:m-0"
    >
      <path
        id="circlePath"
        d="M 135,100
             A 35,35 0 1,1 65,100
             A 35,35 0 1,1 135,100"
        fill="none"
        transform="translate(-50,-50) "
      />

      <text>
        <textPath xlinkHref="#circlePath">
          →&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;Made by Elia
          Orsini
        </textPath>
      </text>

      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        dur="12s"
        begin="0.1s"
        repeatCount="indefinite"
      />
    </svg>
  );
};

export default RotatingSVG;
