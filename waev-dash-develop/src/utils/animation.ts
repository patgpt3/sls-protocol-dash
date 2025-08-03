'use client';
import { keyframes } from '@emotion/react';

export const flashingLoaderKeyframes = (
  primaryColor?: string,
  secondaryColor?: string
) => keyframes`
0% {
  background-color: ${primaryColor || '#9880ff'};
}
50%,
100% {
  background-color: ${secondaryColor || '#ebe6ff'};
}
`;

// TODO(MFB): Update these
export const dotSpinLoaderKeyframes = (primaryColor?: string, secondaryColor?: string) => keyframes`
0%,
100% {
  box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), 0 18px 0 -5px rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), -18px 0 0 -5px rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
}
12.5% {
  box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0), 12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 #9880ff, 0 18px 0 -5px rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), -18px 0 0 -5px rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
}
25% {
  box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0), 12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0), 18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 #9880ff, 0 18px 0 0 #9880ff, -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), -18px 0 0 -5px rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
}
37.5% {
  box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0), 12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0), 18px 0 0 -5px rgba(152, 128, 255, 0), 12.72984px 12.72984px 0 0 #9880ff, 0 18px 0 0 #9880ff, -12.72984px 12.72984px 0 0 #9880ff, -18px 0 0 -5px rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
}
50% {
  box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0), 12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0), 18px 0 0 -5px rgba(152, 128, 255, 0), 12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), 0 18px 0 0 #9880ff, -12.72984px 12.72984px 0 0 #9880ff, -18px 0 0 0 #9880ff, -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
}
62.5% {
  box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0), 12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0), 18px 0 0 -5px rgba(152, 128, 255, 0), 12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), 0 18px 0 -5px rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 0 #9880ff, -18px 0 0 0 #9880ff, -12.72984px -12.72984px 0 0 #9880ff;
}
75% {
  box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0), 18px 0 0 -5px rgba(152, 128, 255, 0), 12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), 0 18px 0 -5px rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), -18px 0 0 0 #9880ff, -12.72984px -12.72984px 0 0 #9880ff;
}
87.5% {
  box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 -5px rgba(152, 128, 255, 0), 12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), 0 18px 0 -5px rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0), -18px 0 0 -5px rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 0 #9880ff;
}
`;

export const dotPulseBeforeKeyframes = (primaryColor?: string) => keyframes`
  0% {
    box-shadow: 9984px 0 0 -5px ${primaryColor || '#9880ff'};
  }
  30% {
    box-shadow: 9984px 0 0 2px ${primaryColor || '#9880ff'};
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px ${primaryColor || '#9880ff'};
  }
`;

export const dotPulseKeyframes = (primaryColor?: string) => keyframes`
  0% {
    box-shadow: 9999px 0 0 -5px ${primaryColor || '#9880ff'};
  }
  30% {
    box-shadow: 9999px 0 0 2px ${primaryColor || '#9880ff'};
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px ${primaryColor || '#9880ff'};
  }
`;

export const dotPulseAfterKeyframes = (primaryColor?: string) => keyframes`
  0% {
    box-shadow: 10014px 0 0 -5px ${primaryColor || '#9880ff'};
  }
  30% {
    box-shadow: 10014px 0 0 2px ${primaryColor || '#9880ff'};
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px ${primaryColor || '#9880ff'};
  }
`;

export const animateDownKeyframes = keyframes`
from {
  transform: scaleY(0);
  opacity: 0;
}
to {
  transform: scaleY(1);
  opacity: 1;
}
`;

export const animateRightKeyframes = keyframes`
from {
  transform: translateX(-100%);
  opacity: 0;
}
to {
  transform: translateX(0%);
  opacity: 1;
}
`;

export const crossSiteFadeInKeyframes = () => keyframes`
        0% { opacity: 0; }
        50% { opacity: 0; }
        100% { opacity: 1; }
      `;

export const fadeInKeyframes = () => keyframes`
      0% { opacity: 0; }
      100% { opacity: 1; }
    `;
export const fadeOutKeyframes = () => keyframes`
      0% { opacity: 1; }
      100% { opacity: 0; }
    `;

export const fadeInFwdKeyframes = () => keyframes`
      0% {
        transform: translateZ(80px);
        opacity: 0;
      }
      100% {
        transform: translateZ(0);
        opacity: 1;
      }
    `;

export const pulseKeyframes = () => keyframes`
      0% { transform: scale(1.15)  rotate(5deg)}
      5% { transform: scale(1)  rotate(0deg)}
      90% { transform: scale(1.15)  rotate(5deg)}
      95% { transform: scale(1)  rotate(0deg)}
    `;

export const stationaryPulseYKeyframes = (scale?: number) => keyframes`
      0% { transform: scaleY(1)}
      50% { transform: scaleY(${scale || 1.04})}
      100% { transform: scaleY(1)}
    `;

export const antiStationaryPulseYKeyframes = (scale?: number) => keyframes`
      0% { transform: scaleY(1)}
      50% { transform: scaleY(${scale || 0.96})}
      100% { transform: scaleY(1)}
    `;

export const dotDotDotFrames = () => keyframes`
0%, 20% {
  content: '';
}
40% {
  content: '.';
}
60% {
  content: '..';
}
80%, 100% {
  content: '...';
}
    `;
