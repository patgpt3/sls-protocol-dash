import { useEffect, ReactNode } from 'react';

// react-router-dom components
import { useLocation } from 'react-router-dom';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';

// Waev Dashboard context
import { useMaterialUIController, setLayout } from 'contexts';
import { Footer } from 'components/Footer';


export function DashboardLayout({ children, sx }: { children: ReactNode, sx?: any }): JSX.Element {
  const [controller, dispatch] = useMaterialUIController();
  const { isMiniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
    // }, [pathname]);
  }, [dispatch, pathname]);

  return (
    <MDBox
      display="flex"
      flex={1}
      flexDirection="column"
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        pr: 4,
        position: 'relative',

        [breakpoints.up('xl')]: {
          marginLeft: isMiniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
        ...sx,
      })}
    >
      {children}
      <Footer />
    </MDBox>
  );
}
