import { MDBox } from 'components';
import { flashingLoaderKeyframes, flatten } from 'utils';

interface LoaderProps {
  sxContainer?: any;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

// https://codepen.io/nzbin/pen/GGrXbp
export const FlashingLoader = (props: LoaderProps) => {
  const sx = {
    container: {
      position: 'relative',
      // overflow: 'hidden',
      background: props.backgroundColor || '#fff',
      MDBoxShadow: '0 .4rem .8rem -.1rem rgba(0, 32, 128, .1), 0 0 0 1px #f0f2f7',
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
      width: '10px',
      height: '10px',
      borderRadius: '5px',
      backgroundColor: props.primaryColor || '#9880ff',
      color: props.primaryColor || '#9880ff',
      animation: `${flashingLoaderKeyframes(
        props.primaryColor,
        props.secondaryColor
      )} 1s infinite linear alternate`,
      animationDelay: '0.25s',
      '&::before, &::after': {
        content: '""',
        display: 'inline - block',
        position: 'absolute',
        top: 0,
      },
      '&::before': {
        left: '-15px',
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        backgroundColor: props.primaryColor || '#9880ff',
        color: props.primaryColor || '#9880ff',
        animation: `${flashingLoaderKeyframes(
          props.primaryColor,
          props.secondaryColor
        )} 1s infinite alternate`,
        animationDelay: '0s',
      },
      '&::after': {
        left: '15px',
        width: '10px',
        height: '10px',
        borderRadius: '5px',
        backgroundColor: props.primaryColor || '#9880ff',
        color: props.primaryColor || '#9880ff',
        animation: `${flashingLoaderKeyframes(
          props.primaryColor,
          props.secondaryColor
        )} 1s infinite alternate`,
        animationDelay: '0.5s',
      },
    },
  };

  return (
    <MDBox className={'Dot-Flashing-Loader'} sx={flatten([sx.stage, props.sxContainer])}>
      <MDBox sx={sx.dots}></MDBox>
    </MDBox>
  );
};
