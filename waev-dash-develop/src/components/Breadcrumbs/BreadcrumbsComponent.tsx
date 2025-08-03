import { ReactNode, useContext } from 'react';

// react-router-dom components
import { Link } from 'react-router-dom';

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import Icon from '@mui/material/Icon';
import pxToRem from 'assets/theme/functions/pxToRem';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { SelectedEntityContext, setIsMiniSidenav, useMaterialUIController } from 'contexts';
import { navbarMobileMenu } from 'components/Navbars/DashboardNavbar/styles';
import { MDButton } from 'components';

// Declaring props types for the Breadcrumbs
interface Props {
  icon: ReactNode;
  title: string;
  route: string | string[];
  light?: boolean;
  [key: string]: any;
}

export function Breadcrumbs({ icon, title, route, light }: Props): JSX.Element {
  const { selectedOrganization } = useContext(SelectedEntityContext);

  const [controller, dispatch] = useMaterialUIController();
  const handleMiniSidenav = () => setIsMiniSidenav(dispatch, !isMiniSidenav);
  const { isMiniSidenav, transparentNavbar, darkMode } = controller;

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }: {
    palette: any;
    functions: any;
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const routes: string[] | any = route.slice(0, -1);

  return (
    <MDBox mr={{ xs: 0, xl: 8 }} minWidth="max-content">
      <MDBox display="flex">
        <MDButton
          component="button"
          onClick={handleMiniSidenav}
          size="large"
          disableRipple
          sx={{
            backgroundColor: 'transparent !important',
            border: 'none !important',
            boxShadow: 'none !important',
            ...navbarMobileMenu,
            ml: 0,
            pl: 0,
            padding: '5px',
            '&.MuiButtonBase-root, .material-icons-round': {
              fontSize: '1.5rem !important',
            },
            minWidth: 0,
          }}
        >
          <Icon sx={iconsStyle}>{isMiniSidenav ? 'menu_open' : 'menu'}</Icon>
          <MDTypography
            component="span"
            variant="body2"
            color={light ? 'white' : 'dark'}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
            ml={1}
          >
            |
          </MDTypography>
        </MDButton>
        <MuiBreadcrumbs
          sx={{
            alignSelf: 'center',
            '& .MuiBreadcrumbs-separator': {
              color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
            },
          }}
        >
          <Link to="/">
            <MDTypography
              component="span"
              variant="body2"
              color={light ? 'white' : 'dark'}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              <Icon>{icon}</Icon>
            </MDTypography>
          </Link>
          {routes.map((el: string) => (
            <Link to={`/${el}`} key={el}>
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color={light ? 'white' : 'dark'}
                opacity={light ? 0.8 : 0.5}
                sx={{ lineHeight: 0 }}
              >
                {el}
              </MDTypography>
            </Link>
          ))}
          <MDTypography
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            color={light ? 'white' : 'dark'}
            sx={{ lineHeight: 0 }}
          >
            {title.replace('-', ' ')}
          </MDTypography>
        </MuiBreadcrumbs>
      </MDBox>

      <MDBox display="flex" sx={{ minHeight: pxToRem(25) }}>
        <MDTypography
          fontWeight="bold"
          textTransform="capitalize"
          variant="h6"
          color={light ? 'white' : 'dark'}
          noWrap
        >
          {selectedOrganization?.attributes?.name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for Breadcrumbs
// Breadcrumbs.defaultProps = {
//   light: false,
// };
