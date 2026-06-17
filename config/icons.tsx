interface IconSvgProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ArrowOut = (props: IconSvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 6L6 18M18 6H7M18 6V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowDown = (props: IconSvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_2087_2593"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect
          x="24"
          y="1.04907e-06"
          width="24"
          height="24"
          transform="rotate(90 24 1.04907e-06)"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_2087_2593)">
        <path
          d="M10.8907 15.751L10.8907 4L13.1093 4L13.1093 15.751L18.4423 10.4179L20 12L12 20L4 12L5.55768 10.4179L10.8907 15.751Z"
          fill="#121212"
        />
      </g>
    </svg>
  );
};

export const XIcon = (props: IconSvgProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_2008_1492"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="20"
      height="20"
    >
      <rect width="20" height="20" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_2008_1492)">
      <path
        d="M5.33366 15.8333L4.16699 14.6666L8.83366 9.99996L4.16699 5.33329L5.33366 4.16663L10.0003 8.83329L14.667 4.16663L15.8337 5.33329L11.167 9.99996L15.8337 14.6666L14.667 15.8333L10.0003 11.1666L5.33366 15.8333Z"
        fill="white"
      />
    </g>
  </svg>
);

export const DielineLogo = (props: IconSvgProps) => (
  <svg
    aria-label="DIELINE"
    focusable="false"
    role="img"
    viewBox="0 0 1344 229"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M213.537 51.889V177.1l-62.769 51.854H0V0h150.768l62.769 51.889Zm-89.298 0H55.976V177.1h68.263l32.678-26.884V79.141L124.239 51.89ZM257.547 0h55.964v228.988h-55.964V0ZM420.28 51.889v36.655h81.539v50.598H420.28V177.1h117.446v51.854H364.315V0h173.411v51.854l-117.446.035ZM747.712 177.1v51.854H581.048V0h55.976v177.1h110.688ZM788.159 0h55.965v228.988h-55.965V0Zm331.951 0v228.988h-100.62L959.627 50.276h-9.701v178.712h-54.942V0h100.619l59.847 178.713h9.65V0h55.01Zm106.44 51.889v36.655h81.54v50.598h-81.54V177.1H1344v51.854h-173.42V0H1344v51.854l-117.45.035Z"
      fill="currentColor"
    ></path>
  </svg>
);
