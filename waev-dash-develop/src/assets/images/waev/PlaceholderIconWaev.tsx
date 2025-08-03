import React from 'react';
import { MDAvatar } from 'components';
import { SxProps, Theme } from '@mui/system';
import { keyframes } from '@emotion/react';
// import { styled, Theme } from '@mui/material/styles';

// import { Theme } from '../styles';

import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import { replaceSpecialCharacters } from 'utils';

const { gradients } = colors;

interface Props {
  id?: string;
  alt: string;
  shadow?: 'none' | 'xs' | 'sm' | 'lg' | 'xl' | 'xxl' | 'md' | 'inset';
  bgColor?:
    | 'info'
    | 'transparent'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'light'
    | 'dark';
  size?: 'xs' | 'sm' | 'lg' | 'xl' | 'xxl';
  variant?: 'rounded' | 'circular' | 'square';
  height?: string;
  width?: string;
  gradient?: string;
  color?: string;
  isAnimating?: boolean;
  sx?: SxProps<Theme>;
}

const waevKeyframes = () => keyframes`
0% {
  transform: translateX(0);
}
100% {
  transform: translateX(100%);
}
`;

export const WaevPlaceholderIcon = ({
  id,
  alt,
  shadow,
  bgColor = 'info',
  size = 'xs',
  variant,
  width = '100%',
  height = '100%',
  gradient,
  color,
  isAnimating,
  sx,
}: Props): JSX.Element => {
  const mid = 50;
  const amp = 22;
  // const cssAnimation = `${isAnimating} ? 1s infinite ${waevKeyframes()} : 1s ease-out ${waevKeyframes()}`;

  return (
    <MDAvatar
      className={`Avatar-${replaceSpecialCharacters(id, '--') || 'Waev'}`}
      alt={alt || 'Waev Icon'}
      size={size}
      bgColor={bgColor}
      shadow={shadow}
      // variant={variant}
      // @ts-ignore
      sx={({ palette: { gradients } }: Theme) => ({
        position: 'relative',
        '&::before, &::after': {
          content: '""',
          display: 'inline - block',
          position: 'absolute',
          top: 0,
        },
        // '&:hover::before': {
        //   transform: 'translateX(100%)',
        // },
        '&::before': {
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: linearGradient(gradients[bgColor]?.main, gradients[bgColor]?.state),
          transition: 'all 1s',
          animation: `1s ease-out ${waevKeyframes()}`,
          // animation: cssAnimation,
          // animation: `${isAnimating} ? 1s infinite ${waevKeyframes()} : 1s ease-out ${waevKeyframes()}`,

          animationFillMode: 'forwards',
        },
        ...sx,
      })}
    >
      <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <title>Layer 1</title>
          {gradient && (
            <defs>
              <linearGradient
                id="grad1"
                gradientUnits="userSpaceOnUse"
                x1="100"
                y1="55"
                x2="0"
                y2="2"
              >
                <stop offset="0%" style={{ stopColor: gradients[gradient].main }} />
                <stop offset="100%" style={{ stopColor: gradients[gradient].state }} />
              </linearGradient>
            </defs>
          )}

          <polyline
            stroke={gradient ? 'url(#grad1)' : color || 'white'}
            strokeWidth="8"
            fill="none"
            // fill="url(#grad1)"
            strokeLinejoin="round"
            strokeLinecap="round"
            // 100,${mid}
            points={`

           8,54
           20,${mid - amp}
           30,${mid}
           40,${mid + amp}
           50,${mid}
           60,${mid - amp}
           70,${mid}
           80,${mid + amp}
           90,46



           `}
            //  900,${mid}
          />
        </g>
      </svg>
    </MDAvatar>
  );
};
