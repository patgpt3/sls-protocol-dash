import { MDBox } from 'components';
import { dotPulseAfterKeyframes, dotPulseBeforeKeyframes, dotPulseKeyframes, flatten } from 'utils';

interface LoaderProps {
  sxContainer?: any;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

// TODO(MFB): Pulse Loader middle dot spacing is off.
export const PulseLoader = (props: LoaderProps) => {
  const dotPulseBefore = dotPulseBeforeKeyframes(props.primaryColor);
  const dotPulse = dotPulseKeyframes(props.primaryColor);
  const dotPulseAfter = dotPulseAfterKeyframes(props.primaryColor);

  const sx = {
    container: {
      position: 'relative',
      background: '#fff',
      MDBoxShadow: `0 .4rem .8rem -.1rem rgba(0, 32, 128, .1), 0 0 0 1px ${
        props.secondaryColor || '#f0f2f7'
      }`,
      borderRadius: '.25rem',
    },
    stage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      padding: '0.5rem 0',
      margin: '0 -5%',
      overflow: 'hidden',
    },
    dots: {
      position: 'relative',
      left: '-9999px',
      width: '10px',
      height: '10px',
      borderRadius: '5px',
      backgroundColor: props.primaryColor || '#9880ff',
      color: props.primaryColor || '#9880ff',
      MDBoxShadow: `9999px 0 0 -5px ${props.primaryColor || '#9880ff'}`,
      animation: `${dotPulse} 1.5s infinite linear`,
      animationDelay: '.25s',
      '&::before, &::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        backgroundColor: props.primaryColor || '#9880ff',
        color: props.primaryColor || '#9880ff',
      },
      '&::before': {
        MDBoxShadow: `9984px 0 0 -5px ${props.primaryColor || '#9880ff'}`,
        animation: `${dotPulseBefore} 1.5s infinite linear`,
        animationDelay: '0s',
      },
      '&::after': {
        MDBoxShadow: `10014px 0 0 -5px ${props.primaryColor || '#9880ff'}`,
        animation: `${dotPulseAfter} 1.5s infinite linear`,
        animationDelay: '.5s',
      },
    },
  };

  return (
    <MDBox className={'Dot-Flashing-Loader'} sx={flatten([sx.container, props.sxContainer])}>
      <MDBox sx={sx.stage}>
        <MDBox sx={sx.dots}></MDBox>
      </MDBox>
    </MDBox>
  );
};
