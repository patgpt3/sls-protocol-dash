/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, ReactNode } from 'react';

// react-router-dom components
import { useLocation, NavLink } from 'react-router-dom';

// @mui material components
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

// Waev Dashboard examples components
import SidenavCollapse from 'components/Sidenav/SidenavCollapse';
import SidenavList from 'components/Sidenav/SidenavList';
import SidenavItem from 'components/Sidenav/SidenavItem';

// Custom styles for the Sidenav
import SidenavRoot from 'components/Sidenav/SidenavRoot';
// import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Waev Dashboard context
import {
  useMaterialUIController,
  setIsMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from 'contexts';

// Declaring props types for Sidenav
interface Props {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark';
  brand?: string | JSX.Element;
  brandName: string;
  routes: {}[];
  [key: string]: any;
}

export function Sidenav({ color, brand, brandName, routes, ...rest }: Props): JSX.Element {
  const [openCollapse, setOpenCollapse] = useState<boolean | string>(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState<boolean | string>(false);
  const [controller, dispatch] = useMaterialUIController();
  const { isMiniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split('/').slice(1)[0];
  const items = pathname.split('/').slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];

  let textColor:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'dark'
    | 'white'
    | 'inherit'
    | 'text'
    | 'light' = 'white';

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = 'dark';
  } else if (whiteSidenav && darkMode) {
    textColor = 'inherit';
  }

  const closeSidenav = () => setIsMiniSidenav(dispatch, true);

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, [collapseName, itemParentName]);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      // setIsMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener('resize', handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleMiniSidenav);
    // }, [dispatch, location]);
  }, [dispatch, location, transparentSidenav, whiteSidenav]);

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse: any) => {
    const template = collapse.map(({ name, route, key, href, icon }: any) =>
      href ? (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          <SidenavItem name={name} nested />
        </Link>
      ) : (
        <NavLink to={route} key={key} style={{ textDecoration: 'none' }}>
          <SidenavItem name={name} active={route === pathname} icon={icon} nested />
        </NavLink>
      )
    );

    return template;
  };
  // Render the all the collapses from the routes.js
  const renderCollapse = (collapses: any) =>
    collapses.map(({ name, collapse, route, href, key, icon }: any) => {
      let returnValue;

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={color}
            name={name}
            icon={icon}
            active={key === itemParentName ? 'isParent' : false}
            open={openNestedCollapse === key}
            onClick={({ currentTarget }: any) =>
              openNestedCollapse === key && currentTarget.classList.contains('MuiListItem-root')
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            <SidenavItem color={color} name={name} active={key === itemName} icon={icon} />
          </Link>
        ) : (
          <NavLink to={route} key={key} style={{ textDecoration: 'none' }}>
            <SidenavItem color={color} name={name} active={key === itemName} icon={icon} />
          </NavLink>
        );
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, isName, noCollapse, key, href, route, isHidden, sx }: any) => {
      let returnValue;
      if (isHidden) {
        return <></>;
      }

      if (type === 'collapse') {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: 'none', ...sx }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                isName={isName}
                active={route === pathname}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <MDBox sx={sx} key={key}>
              <NavLink to={route} onClick={window.innerWidth <= 1200 && closeSidenav}>
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  noCollapse={noCollapse}
                  isName={isName}
                  active={route === pathname}
                >
                  {collapse ? renderCollapse(collapse) : null}
                </SidenavCollapse>
              </NavLink>
            </MDBox>
          );
        } else {
          returnValue = (
            <MDBox sx={sx} key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                isName={isName}
                active={route === pathname}
                open={openCollapse === key}
                onClick={() =>
                  openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key)
                }
                sx={sx}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </MDBox>
          );
        }
      } else if (type === 'title') {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
            sx={sx}
          >
            {title}
          </MDTypography>
        );
      } else if (type === 'divider') {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, isMiniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: 'block', xl: 'none' }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: 'pointer' }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: 'bold' }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox
          component={NavLink}
          to="/"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: '1.2vw', mb: '1.2vw' }}
        >
          {brand &&
            (typeof brand === 'string' ? (
              <MDBox component="img" src={brand} alt="Brand" width="10rem" />
            ) : (
              brand
            ))}
          {/* <MDBox
            width={!brandName && "100%"}
            sx={(theme: any) => sidenavLogoLabel(theme, { isMiniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox> */}
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Declaring default props for Sidenav
// Sidenav.defaultProps = {
//   color: 'info',
//   brand: '',
// };

export default Sidenav;
