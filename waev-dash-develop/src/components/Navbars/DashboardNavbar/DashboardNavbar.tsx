import { useState, useEffect, useContext } from 'react';

// react-router components
import { useLocation, Link } from 'react-router-dom';

// @material-ui core components

import { AppBar, Divider, IconButton, Icon, Menu, Toolbar, Tooltip, Badge } from '@mui/material';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';

import { Breadcrumbs } from 'components/Breadcrumbs';
import {
  FlashingLoader,
  MDButton,
  NotificationItem,
  waevHoverClass,
  WaevPlaceholderIcon,
  WaevUserIcon,
} from 'components';

import colors from 'assets/theme/base/colors';
import rgba from 'assets/theme/functions/rgba';

// Custom styles for DashboardNavbar
import { navbar, navbarContainer, navbarRow, navbarIconButton } from './styles';

// Waev Dashboard context
import {
  useMaterialUIController,
  setTransparentNavbar,
  CurrentUserContext,
  SelectedEntityContext,
  ApiLoaderContext,
} from 'contexts';
import { useListOrganizations } from 'hooks';
import { TourContext } from 'contexts/tourContext';

// Declaring prop types for DashboardNavbar
interface Props {
  absolute?: boolean;
  light?: boolean;
  isMini?: boolean;
}

export function DashboardNavbar({ absolute, light, isMini }: Props): JSX.Element {
  const { currentUser, token, isWaevAdmin } = useContext(CurrentUserContext);
  const { isLoadingGlobal, isFirstLoad } = useContext(ApiLoaderContext);
  const { setSelectedOrganizationId, selectedOrganization } = useContext(SelectedEntityContext);
  const { data: organizations, isLoading: isLoadingOrganizations } = useListOrganizations(
    currentUser,
    token
  );
  const { onHelpClick, defaultFlags, isHiddenPoppers, isIncompleteTask, isHelpDisabled } =
    useContext(TourContext);
  const [navbarType, setNavbarType] = useState<
    'fixed' | 'absolute' | 'relative' | 'static' | 'sticky'
  >();
  const [openMenu, setOpenMenu] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { transparentNavbar, fixedNavbar, darkMode } = controller;
  const route = useLocation().pathname.split('/').slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener('scroll', handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleOpenMenu = (event: any) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const sxAnimateRows = {};
  organizations?.length &&
    organizations.forEach((org, i) => {
      // @ts-ignore
      sxAnimateRows[`div>ul>li:nth-of-type(${i + 1})`] = waevHoverClass(org.id);
    });

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      // @ts-ignore
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      className="org-selector"
      sx={{ mt: 2, ...sxAnimateRows }}
    >
      {isLoadingOrganizations && (
        <MDBox alignSelf="center" sx={{ width: '100%' }} data-testid="organization-loading-status">
          <FlashingLoader />
        </MDBox>
      )}

      {organizations?.map((org, i) => {
        return (
          <NotificationItem
            icon={
              <WaevPlaceholderIcon
                id={org.id}
                alt={org.attributes.name[0]}
                size="xs"
                shadow="sm"
                bgColor={org.id === selectedOrganization?.id ? 'info' : 'secondary'}
                isAnimating={true}
              />
            }
            key={`notificationItem-${i}`}
            title={org.attributes.name}
            onClick={() => {
              setSelectedOrganizationId(org.id);
              handleCloseMenu();
            }}
          />
        );
      })}

      {organizations?.length ? <Divider /> : undefined}

      <Link to="/pages/account/settings" onClick={() => handleCloseMenu()} tabIndex={0}>
        <NotificationItem
          icon={
            <Icon sx={{ color: route[0] === 'pages' ? info.main : rgba(white.main, 0.6) }}>
              settings
            </Icon>
          }
          title="Settings"
        />
      </Link>
      <Link to="/magiclink" onClick={() => handleCloseMenu()} tabIndex={0}>
        <NotificationItem
          icon={
            <Icon sx={{ color: route[0] === 'magiclink' ? info.main : rgba(white.main, 0.6) }}>
              logout
            </Icon>
          }
          title="Log Out"
        />
      </Link>
    </Menu>
  );

  const { info, white } = colors;

  return (
    <AppBar
      position={!absolute ? navbarType || 'sticky' : 'absolute'}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar
        sx={{
          ...navbarContainer,
          flexDirection: 'row',
          paddingRight: '0 !important',
          paddingLeft: '1% !important',
        }}
      >
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini }, true)}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox
              color={light ? 'white' : 'inherit'}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              {/* <Link to="/domains">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={{ color: route[0] === 'domains' ? info.main : rgba(white.main, 0.6) }}>
                    public
                  </Icon>
                </IconButton>
              </Link> */}

              {/* <Link to="">
                <Tooltip
                  title={
                    isHelpDisabled
                      ? 'Help'
                      : defaultFlags.helpOverride
                      ? isHiddenPoppers
                        ? 'Hidden Messages'
                        : 'Turn Help Off'
                      : isIncompleteTask
                      ? 'Incomplete Task'
                      : 'Help'
                  }
                  placement="left"
                >
                  <span>
                    <IconButton
                      id="help"
                      size="small"
                      disableRipple
                      disabled={isHelpDisabled}
                      onClick={() => onHelpClick()}
                    >
                      {!isLoadingGlobal && isFirstLoad ? (
                        <Badge
                          badgeContent=""
                          color="info"
                          variant="dot"
                          invisible={defaultFlags.isHandhold ? !isHiddenPoppers : !isIncompleteTask}
                        >
                          <Icon
                            sx={{
                              color: isHelpDisabled
                                ? 'rgba(255, 255, 255, 0.6)'
                                : defaultFlags.helpOverride
                                ? info.main
                                : 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            help
                          </Icon>
                        </Badge>
                      ) : (
                        <Icon
                          sx={{
                            color: defaultFlags.helpOverride
                              ? isHelpDisabled
                                ? 'rgba(255, 255, 255, 0.6)'
                                : info.main
                              : 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          help
                        </Icon>
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Link>

              <Link to="" style={{ pointerEvents: 'none' }}>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ color: info.main, zIndex: '1500', height: '40px' }}
                />
              </Link> */}

              <Link to="/pages/account/settings">
                <IconButton id="settingsNavIcon" sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={{ color: route[0] === 'pages' ? info.main : rgba(white.main, 0.6) }}>
                    settings
                  </Icon>
                </IconButton>
              </Link>
              <Link to="/deployments">
                <IconButton
                  id="deploymentsNavIcon"
                  sx={navbarIconButton}
                  size="small"
                  disableRipple
                >
                  <Icon
                    sx={{ color: route[0] === 'deployments' ? info.main : rgba(white.main, 0.6) }}
                  >
                    rocket_launch
                  </Icon>
                </IconButton>
              </Link>
              <Link to="/data/view-data">
                <IconButton id="dataNavIcon" sx={navbarIconButton} size="small" disableRipple>
                  <Icon
                    sx={{
                      color:
                        route[0] === 'data' && route[1] === 'view-data'
                          ? info.main
                          : rgba(white.main, 0.6),
                    }}
                  >
                    data_object
                  </Icon>
                </IconButton>
              </Link>
              <Link to="/data/create-data">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon
                    sx={{
                      color:
                        route[0] === 'data' && route[1] === 'create-data'
                          ? info.main
                          : rgba(white.main, 0.6),
                    }}
                  >
                    control_point
                  </Icon>
                </IconButton>
              </Link>
              <Link to="/data-unions">
                <IconButton id="dataUnionsNavIcon" sx={navbarIconButton} size="small" disableRipple>
                  <Icon
                    sx={{ color: route[0] === 'data-unions' ? info.main : rgba(white.main, 0.6) }}
                  >
                    group_work
                  </Icon>
                </IconButton>
              </Link>
              <Link to="/documentation">
                <IconButton id="docsNavIcon" sx={navbarIconButton} size="small" disableRipple>
                  <Icon
                    sx={{ color: route[0] === 'documentation' ? info.main : rgba(white.main, 0.6) }}
                  >
                    integration_instructions
                  </Icon>
                </IconButton>
              </Link>
              {isWaevAdmin && (
                <Link to="/admin-panel">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon
                      sx={{ color: route[0] === 'admin-panel' ? info.main : rgba(white.main, 0.6) }}
                    >
                      admin_panel_settings
                    </Icon>
                  </IconButton>
                </Link>
              )}

              <MDButton
                size="small"
                disableRipple
                sx={{
                  backgroundColor: 'transparent !important',
                  border: 'none !important',
                  padding: '0 !important',
                  minWidth: '48px',
                  boxShadow: 'none !important',

                  ...navbarIconButton,
                }}
                onClick={handleOpenMenu}
                component="button"
              >
                <WaevUserIcon
                  id={currentUser?.attributes?.email}
                  isToHex={true}
                  isAnimating={isLoadingGlobal}
                  size="sm"
                />
              </MDButton>
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenMenu}
              >
                <MDBadge badgeContent={9} color="error" size="xs" circular>
                  <Icon sx={iconsStyle}>notifications</Icon>
                </MDBadge>
              </IconButton> */}
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Declaring default props for DashboardNavbar
// DashboardNavbar.defaultProps = {
//   absolute: false,
//   light: false,
//   isMini: false,
// };
