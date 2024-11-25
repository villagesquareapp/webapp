import React, { SVGProps } from "react";

const SvgSmallCoin = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" className="svg-icon" {...props}>
      <g filter="url(#filter0_f_1233_130939)">
        <path
          d="M5.84375 11.7656V20.3721C5.84375 22.7497 14.7813 24.6754 25.8057 24.6754C36.8301 24.6754 45.7677 22.7483 45.7677 20.3721V11.7656H5.84375Z"
          fill="#FCA40B"
        />
        <path
          d="M25.8057 16.0682C36.8304 16.0682 45.7677 14.1409 45.7677 11.7636C45.7677 9.38621 36.8304 7.45898 25.8057 7.45898C14.781 7.45898 5.84375 9.38621 5.84375 11.7636C5.84375 14.1409 14.781 16.0682 25.8057 16.0682Z"
          fill="#FCCF23"
        />
      </g>
      <path
        d="M5.84375 11.7656V20.3721C5.84375 22.7497 14.7813 24.6754 25.8057 24.6754C36.8301 24.6754 45.7677 22.7483 45.7677 20.3721V11.7656H5.84375Z"
        fill="#FCA40B"
      />
      <path
        d="M25.8057 16.0682C36.8304 16.0682 45.7677 14.1409 45.7677 11.7636C45.7677 9.38621 36.8304 7.45898 25.8057 7.45898C14.781 7.45898 5.84375 9.38621 5.84375 11.7636C5.84375 14.1409 14.781 16.0682 25.8057 16.0682Z"
        fill="#FCCF23"
      />
      <defs>
        <filter
          id="filter0_f_1233_130939"
          x="0.29975"
          y="1.91498"
          width="51.0099"
          height="28.3048"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2.772" result="effect1_foregroundBlur_1233_130939" />
        </filter>
      </defs>
    </svg>
  );
};

export default SvgSmallCoin;
