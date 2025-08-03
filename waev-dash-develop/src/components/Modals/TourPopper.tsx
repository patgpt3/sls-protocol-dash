import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';

import { MDBox, MDTypography } from 'components';
import colors from 'assets/theme-dark/base/colors';
import { keyframes } from '@emotion/react';
import { OptInFlagContextProvider, TourContext } from 'contexts';
import { useContext, useEffect, useState } from 'react';
import { Icon } from '@mui/material';
import rgba from 'assets/theme-dark/functions/rgba';

interface TourPopperProps {
  isEnabled?: boolean;
  open?: boolean;
  elementId?: string;
  horizontalOffset?: number;
  verticalOffset?: number;
  arrowOffset?: number;
  message?: string;
  icon?: string;
  isHideArrow?: boolean;
  arrowPlacement?: 'bottom';
  placement?:
    | 'auto-end'
    | 'auto-start'
    | 'auto'
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  setIsOpen?: (value: any) => void;
  onCloseClick?: () => void;
  popperCount?: () => void;
}

export function TourPopper({
  isEnabled,
  open,
  horizontalOffset,
  verticalOffset,
  arrowOffset,
  message,
  icon,
  setIsOpen,
  elementId,
  isHideArrow,
  placement,
  onCloseClick,
  arrowPlacement,
}: TourPopperProps) {
  const [closePopper, setClosePopper] = useState<boolean>(false);
  const { setIsHiddenPoppers, doPopperAction, popperCount } = useContext(TourContext);

  useEffect(() => {
    if (popperCount > 0) {
      open && !isEnabled && doPopperAction('decrement');
    }
  }, [!isEnabled]);

  useEffect(() => {
    isEnabled && doPopperAction('increment');
  }, [isEnabled]);

  if (isEnabled === false) return <></>;

  const { info, white } = colors;

  const floatKeyframes = () => keyframes`
  0% { transform: translate(0,  0px); }
        50%  { transform: translate(0, 10px); }
        100%   { transform: translate(0, -0px); }
`;

  return (
    <OptInFlagContextProvider>
      <MDBox
        onClick={() => {
          setClosePopper(true);
          setIsHiddenPoppers(true);
          if (popperCount > 0) {
            doPopperAction('decrement');
          }
        }}
      >
        {/* @ts-ignore */}
        <Popper
          open={!!document.querySelector(`#${elementId}`) && !closePopper ? open : false}
          anchorEl={document.querySelector(`#${elementId}`)}
          placement={placement || 'bottom-end'}
          transition
          style={{
            zIndex: '1500',
          }}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [horizontalOffset, verticalOffset],
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={700}>
              <MDBox
                sx={{
                  animation: `3s  ease-in-out infinite ${floatKeyframes()}`,
                }}
              >
                {isHideArrow ? (
                  <></>
                ) : (
                  <MDBox
                    sx={{
                      mt: arrowPlacement === 'bottom' ? '64px' : '0px',
                      backgroundColor: info.main,
                      content: '""',
                      display: 'flex',
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      top: -6,
                      transform: 'rotate(45deg)',
                      left: `${arrowOffset}px`,
                    }}
                  />
                )}
                <MDTypography
                  sx={{
                    p: 2,
                    backgroundColor: info.main,
                    margin: 1,
                    borderRadius: 3,
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  {icon && (
                    <Icon sx={{ color: rgba(white.main, 0.9), mr: 1, verticalAlign: 'middle' }}>
                      {icon}
                    </Icon>
                  )}
                  {message}
                </MDTypography>
              </MDBox>
            </Fade>
          )}
        </Popper>
      </MDBox>
    </OptInFlagContextProvider>
  );
}
