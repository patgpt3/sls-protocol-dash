import React from 'react';
import { MDAvatar, MDBox } from 'components';
import { keyframes } from '@emotion/react';

import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import { Permissions } from 'types';
import { toHex, replaceSpecialCharacters } from 'utils';
import { GradientsTypes } from 'types/definitions';

const { userGradients } = colors;

interface Props {
  id: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  isToHex?: boolean;
  sx?: any;
  isAnimating?: boolean;
  permissions?: Permissions;
}

const SPECIAL_CHARACTER_REPLACE = '--';

const waevKeyframes = () => keyframes`
0% {
  transform: translateX(0);
}
100% {
  transform: translateX(100%);
}
`;

export const waevHoverClass = (id: string): Object => {
  const hoverClass = { '&:hover': {} };

  // @ts-ignore
  hoverClass['&:hover'][`.Avatar-${replaceSpecialCharacters(id, SPECIAL_CHARACTER_REPLACE)}`] = {
    '&::before': {
      // transform: 'translateX(50%)',
      transform: 'none',
      // background: 'blue !important',
      animation: `1s ease-out ${waevKeyframes()}`,
      animationFillMode: 'none',
      animationDelay: '0.5s',
      animationIterationCount: 'infinite',
    },
  };
  return hoverClass;
};

const ringWrapper = (
  content: JSX.Element,
  gradient?: GradientsTypes,
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
): JSX.Element => {
  if (gradient) {
    return (
      <MDAvatar
        alt="Waev User"
        size={size}
        sx={{
          backgroundImage: linearGradient(gradient.main, gradient.state),
          position: 'relative',
        }}
      >
        {content}
      </MDAvatar>
    );
  }
  return content;
};

export const WaevUserIcon = ({
  id,
  size = 'xs',
  isToHex,
  permissions = undefined,
  isAnimating,
  sx,
}: Props): JSX.Element => {
  let idHex = id;
  if (isToHex) {
    idHex = toHex(id).split('').reverse().join('');
  }
  const negator = 1;
  const first = parseInt(idHex.slice(-2), 16) * 2 * negator || 0;
  const second = parseInt(idHex.slice(-4, -2), 16) * 2 * negator || 0;
  const third = parseInt(idHex.slice(-6, -4), 16) * 2 * negator || 0;
  const fourth = parseInt(idHex.slice(-7, -6), 16) || 0;

  const mid = 550;

  let ringGradient: GradientsTypes | undefined = colors.gradients.secondary;
  if (permissions?.admin) {
    ringGradient = colors.gradients.error;
  }
  if (permissions?.owner) {
    ringGradient = colors.gradients.warning;
  }

  return (
    <MDBox sx={{ position: 'relative' }}>
      {ringWrapper(
        <MDAvatar
          alt="Waev User"
          size={size}
          className={`Avatar-${replaceSpecialCharacters(id, SPECIAL_CHARACTER_REPLACE)}`}
          sx={{
            backgroundImage: linearGradient(
              userGradients[fourth].main,
              userGradients[fourth].state
            ),
            transform: ringGradient ? 'scale(0.9)' : 'scale(1)',
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              display: 'inline - block',
              position: 'absolute',
              top: 0,
            },
            '&::before': {
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: linearGradient(userGradients[fourth].main, userGradients[fourth].state),
              transition: 'all 1s',
              animation: isAnimating
                ? `1.5s infinite ${waevKeyframes()}`
                : `1s ease-out ${waevKeyframes()}`,
              animationFillMode: 'forwards',
              animationIterationCount: isAnimating ? 'infinite' : 1,
            },
            ...sx,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 900 1100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>Layer 1</title>

              <polyline
                stroke="white"
                strokeWidth="55"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={`
           75,${mid}
           150,${mid}

           200,${mid - first}
           300,${mid + first}

           400,${mid - second}
           500,${mid + second}

           600,${mid - third}
           700,${mid + third}

           750,${mid}
           825,${mid}
           `}
              />
            </g>
          </svg>
        </MDAvatar>,
        ringGradient,
        size
      )}
    </MDBox>
  );
};
