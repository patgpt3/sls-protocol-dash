// @mui material components
import Drawer from '@mui/material/Drawer';
import { styled, Theme } from '@mui/material/styles';

export default styled(Drawer)(({ theme, ownerState }: { theme?: Theme | any; ownerState: any }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, isMiniSidenav, darkMode } = ownerState;

  const sidebarWidth = 250;
  const { gradients, background } = palette;
  const { xxl } = boxShadows;
  const { pxToRem, linearGradient } = functions;

  let backgroundValue = darkMode
    ? background.sidenav
    : linearGradient(gradients.dark.main, gradients.dark.state);


  // if (transparentSidenav) {
  //   backgroundValue = transparent.main;
  // } else if (whiteSidenav) {
  //   backgroundValue = white.main;
  // }

  // styles for the sidenav when isMiniSidenav={false}
  const drawerOpenStyles = () => ({
    background: backgroundValue,
    transform: 'translateX(0)',
    transition: transitions.create('transform', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    '&::-webkit-scrollbar': {
      display: 'none' /* hid scroll bar for Chrome and Safari */,
    },
    // '&':{
    '&': {
      // '-ms-overflow-style': 'none',  /* IE and Edge */
      msOverflowStyle: 'none' /* IE and Edge */,
      scrollbarWidth: 'none' /* Firefox */,
    },

    [breakpoints.up('xl')]: {
      boxShadow: transparentSidenav ? 'none' : xxl,
      marginBottom: transparentSidenav ? 0 : 'inherit',
      left: '0',
      width: sidebarWidth,
      transform: 'translateX(0)',
      transition: transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidenav when isMiniSidenav={true}
  const drawerCloseStyles = () => ({
    background: backgroundValue,
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create('transform', {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up('xl')]: {
      boxShadow: transparentSidenav ? 'none' : xxl,
      marginBottom: transparentSidenav ? 0 : 'inherit',
      left: '0',
      width: pxToRem(96),
      overflowX: 'hidden',
      transform: 'translateX(0)',
      transition: transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    '& .MuiDrawer-paper': {
      boxShadow: xxl,
      border: 'none',

      ...(isMiniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});
