import { MDBox } from 'components';
import { dotSpinLoaderKeyframes, flatten } from 'utils';

interface LoaderProps {
  sxContainer?: any;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export const DotSpinLoader = (props: LoaderProps) => {
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

      backgroundColor: 'transparent',
      boxShadow:
        '0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0), 0 18px 0 0 rgba(152, 128, 255, 0), -12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0), -18px 0 0 0 rgba(152, 128, 255, 0), -12.72984px -12.72984px 0 0 rgba(152, 128, 255, 0)',

      animation: `${dotSpinLoaderKeyframes(
        props.primaryColor,
        props.secondaryColor
      )} 1.5s infinite linear`,
    },
  };

  return (
    <MDBox className={'Dot-Flashing-Loader'} sx={flatten([sx.stage, props.sxContainer])}>
      <MDBox sx={sx.dots}></MDBox>
    </MDBox>
  );
};
